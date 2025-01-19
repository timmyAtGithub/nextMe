const apiConfig = require("../configs/apiConfig");
const pool = require("../db");

const createGroup = async (req, res) => {
    const { name, description, members, groupImageUrl } = req.body;
    console.log("Starte Gruppen Erstellung", req.body);

    if (!name || !members || members.length === 0) {
        return res
            .status(400)
            .json({ message: "Group name and members are required." });
    }

    try {
        const allMembers = [...new Set([req.user.id, ...members])];

        const groupResult = await pool.query(
            `INSERT INTO groupchat (name, description, group_image_url, owner_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
            [name, description, groupImageUrl, req.user.id]
        );

        const groupId = groupResult.rows[0].id;
        console.log("Group created, ID:", groupId);

        const memberQueries = allMembers.map((userId) =>
            pool.query(
                `INSERT INTO GroupMembers (group_id, user_id) VALUES ($1, $2)`,
                [groupId, userId]
            )
        );
        await Promise.all(memberQueries);

        res.status(201).json({
            message: "Group created successfully.",
            group: groupResult.rows[0],
        });
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Failed to create group." });
    }
};


const getGroupMembers = async (req, res) => {
    const { groupId } = req.params;
    try {
        const members = await pool.query(
            `SELECT gm.user_id, u.username, u.profile_image
         FROM GroupMembers gm
         JOIN Users u ON gm.user_id = u.id
        WHERE gm.group_id = $1`,
            [groupId]
        );
        res.status(200).json(members.rows);
    } catch (error) {
        console.error("Error fetching group members:", error);
        res.status(500).json({ message: "Failed to fetch group members." });
    }
};

const deleteGroup = async (req, res) => {
    const { groupId } = req.params;
    try {
        const group = await pool.query(
            `SELECT * FROM GroupChat WHERE id = $1 AND owner_id = $2`,
            [groupId, req.user.id]
        );
        if (group.rows.length === 0) {
            return res
                .status(404)
                .json({ message: "Group not found or unauthorized." });
        }
        await pool.query(`DELETE FROM GroupChat WHERE id = $1`, [groupId]);
        res.status(200).json({ message: "Group deleted successfully." });
    } catch (error) {
        console.error("Error deleting group:", error);
        res.status(500).json({ message: "Failed to delete group." });
    }
};

const addGroupMember = async (req, res) => {
    const { groupId, userId } = req.body;
    if (!groupId || !userId) {
        return res
            .status(400)
            .json({ message: "Group ID and User ID are required." });
    }

    try {
        const isOwner = await isGroupOwner(groupId, req.user.id);
        if (!isOwner) {
            return res
                .status(403)
                .json({ message: "Only the group owner can add members." });
        }

        const existingMember = await pool.query(
            `SELECT * FROM GroupMembers WHERE group_id = $1 AND user_id = $2`,
            [groupId, userId]
        );
        if (existingMember.rows.length > 0) {
            return res
                .status(400)
                .json({ message: "User is already a member of this group." });
        }

        await pool.query(
            `INSERT INTO GroupMembers (group_id, user_id) VALUES ($1, $2)`,
            [groupId, userId]
        );
        res.status(201).json({ message: "Member added successfully." });
    } catch (error) {
        console.error("Error adding group member:", error.message);
        res.status(500).json({ message: "Failed to add member." });
    }
};

const removeGroupMember = async (req, res) => {
    const { groupId, userId } = req.body;
    if (!groupId || !userId) {
        return res
            .status(400)
            .json({ message: "Group ID and User ID are required." });
    }

    try {
        const isOwner = await isGroupOwner(groupId, req.user.id);
        if (!isOwner) {
            return res
                .status(403)
                .json({ message: "Only the group owner can remove members." });
        }

        const member = await pool.query(
            `SELECT * FROM GroupMembers WHERE group_id = $1 AND user_id = $2`,
            [groupId, userId]
        );
        if (member.rows.length === 0) {
            return res
                .status(404)
                .json({ message: "User is not a member of this group." });
        }

        await pool.query(
            `DELETE FROM GroupMembers WHERE group_id = $1 AND user_id = $2`,
            [groupId, userId]
        );
        res.status(200).json({ message: "Member removed successfully." });
    } catch (error) {
        console.error("Error removing group member:", error.message);
        res.status(500).json({ message: "Failed to remove member." });
    }
};

const isGroupOwner = async (groupId, userId) => {
    const result = await pool.query(
        `SELECT owner_id FROM GroupChat WHERE id = $1`,
        [groupId]
    );
    if (result.rows.length === 0) {
        throw new Error("Group not found");
    }
    return result.rows[0].owner_id === userId;
};

const uploadGroupImage = async (req, res) => {
    console.log("Starting upload process...");

    try {
        console.log("Headers:", req.headers);
        console.log("File:", req.file);
        console.log("Body:", req.body);

        if (!req.file) {
            console.error("No file received");
            return res.status(400).json({
                success: false,
                message: "No file uploaded or invalid file type",
                debug: {
                    contentType: req.headers["content-type"],
                    hasBody: !!req.body,
                    bodyKeys: Object.keys(req.body),
                },
            });
        }

        const imagePath = `/uploads/groupImages/${req.file.filename}`;
        const fullImagePath = `${apiConfig.BASE_URL}/uploads/groupImages/${req.file.filename}`;

        console.log("Generated image path:", imagePath);
        console.log("Generated fullImage path:", fullImagePath);

        return res.status(200).json({
            success: true,
            message: "Media sent successfully",
            imageUrl: imagePath,
            fullImagePath,
            imagePath
        });

    } catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error during upload",
            error: err.message
        });
    }
};

const getUserGroups = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `
        SELECT 
          g.id,
          g.name AS group_name,
          g.group_image_url,
          COALESCE(
            (
              SELECT text 
              FROM group_messages 
              WHERE group_id = g.id 
              ORDER BY created_at DESC 
              LIMIT 1
            ), 
            'No messages yet'
          ) AS lastMessage,
          COALESCE(
            (
              SELECT created_at 
              FROM group_messages 
              WHERE group_id = g.id 
              ORDER BY created_at DESC 
              LIMIT 1
            ), 
            '1970-01-01T00:00:00.000Z'
          ) AS lastMessageTimestamp
        FROM groupchat g
        JOIN groupmembers gm ON g.id = gm.group_id
        WHERE gm.user_id = $1
        ORDER BY lastMessageTimestamp DESC;
        `,
            [userId]
        );

       
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching user groups:", error);
        res.status(500).json({ message: "Failed to fetch user groups" });
    }
};


const getGroupMessages = async (req, res) => {
    const { groupId } = req.params;

    try {
        const messagesQuery = `
        SELECT 
          messages.id,
          messages.text,
          messages.user_id,
          messages.type,
          messages.content,
          messages.created_at
        FROM 
          group_messages AS messages
        JOIN 
          users ON messages.user_id = users.id
        WHERE 
          messages.group_id = $1
        ORDER BY 
          messages.created_at
      `;

        const { rows: messages } = await pool.query(messagesQuery, [groupId]);
        res.json(messages);
    } catch (err) {
        console.error('Error fetching group messages:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const sendGroupMessage = async (req, res) => {
    const userId = req.user.id;
    const { groupId, text, type = 'text', content = null } = req.body;

    try {
        const groupCheck = await pool.query(
            `SELECT * 
         FROM groupmembers 
         WHERE group_id = $1 AND user_id = $2`,
            [groupId, userId]
        );

        if (groupCheck.rows.length === 0) {
            return res.status(403).json({ message: 'You are not allowed to send messages in this group.' });
        }
        const result = await pool.query(
            `INSERT INTO group_messages (group_id, user_id, text, type, content, created_at) 
         VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
            [groupId, userId, text, type, content]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error sending group message:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const sendGroupMedia = async (req, res) => {
    try {
        console.log("--- Upload Media Request Received ---");
        console.log("Headers:", req.headers);
        console.log("Request Body:", req.body);

        if (!req.file) {
            return res.status(400).json({ message: "No media uploaded" });
        }

        const groupId = parseInt(req.body.groupId, 10);
        if (isNaN(groupId)) {
            return res.status(400).json({ message: "Invalid groupId" });
        }

        const senderId = req.user.id;
        const mediaPath = `/uploads/media/${req.file.filename}`;
        const fullMediaPath = `${process.env.BASE_URL}/uploads/media/${req.file.filename}`;

        console.log("Group ID:", groupId);
        console.log("Sender ID:", senderId);
        console.log("Media Path:", mediaPath);

        const groupCheck = await pool.query(
            `SELECT * 
         FROM groupmembers 
         WHERE group_id = $1 AND user_id = $2`,
            [groupId, senderId]
        );

        if (groupCheck.rows.length === 0) {
            return res.status(403).json({ message: "You are not a member of this group" });
        }

        await pool.query(
            'INSERT INTO group_messages (group_id, user_id, type, text, content, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
            [groupId, senderId, 'media', '[Media]', mediaPath]
        );

        res.json({ message: "Media sent successfully", fullMediaPath });
    } catch (err) {
        console.error("Error uploading media:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

const getGroupDetails = async (req, res) => {
    const { groupId } = req.params;
    try {
        const groupDetails = await pool.query(
            'SELECT * FROM groupchat WHERE id = $1',
            [groupId]
        );
        if (groupDetails.rows.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(groupDetails.rows[0]);
    } catch (err) {
        console.error('Error fetching group details:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getGroupMessagesWithName = async (req, res) => {
    const { groupId } = req.params;
    try {
        const messagesQuery = `
        SELECT 
          messages.id,
          messages.text,
          messages.user_id,
          messages.type,
          messages.content,
          messages.created_at,
          users.username
        FROM 
          group_messages AS messages
        JOIN 
          users ON messages.user_id = users.id
        WHERE 
          messages.group_id = $1
        ORDER BY 
          messages.created_at
      `;

        const { rows: messages } = await pool.query(messagesQuery, [groupId]);

        res.json(messages);
    } catch (err) {
        console.error('Error fetching group messages:', err);
        res.status(500).json({ message: 'Server error' });
    }
};




module.exports = { getGroupMessagesWithName, getGroupDetails, sendGroupMedia, sendGroupMessage, getGroupMessages, getUserGroups, uploadGroupImage, createGroup, getGroupMembers, deleteGroup, addGroupMember, removeGroupMember, };
