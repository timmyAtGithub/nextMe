import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImageManipulator from "expo-image-manipulator";
import apiConfig from "../configs/apiConfig";
import { useTheme } from "../settings/themeContext";
 



interface Friend {
  id: number;
  name: string;
  profile_image?: string;
}

interface GroupCreateResponse {
  group: {
    id: number;
  };
}

const GroupCreation = () => {
  const { GlobalStyles } = useTheme();
  const router = useRouter();
  const { preselectedFriend } = useLocalSearchParams();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant camera roll permissions to upload images."
        );
      }
    };

    requestPermissions();
    fetchFriends();
  }, []);

  useEffect(() => {
    if (preselectedFriend) {
      setSelectedFriends([parseInt(preselectedFriend as string, 10)]);
    }
  }, [preselectedFriend]);

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You must be logged in.");
        router.push("./login");
        return;
      }

      const response = await fetch(`${apiConfig.BASE_URL}/api/user/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }

      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
      Alert.alert("Error", "Failed to load friends. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectFriend = (friendId: number) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const resizeImage = async (uri: string) => {
    try {
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      return resizedImage.uri;
    } catch (error) {
      console.error("Error resizing image:", error);
      throw error;
    }
  };


  const uploadImage = async (uri: string) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      const file = {
        uri: uri,
        type: "image/jpeg",
        name: "groupImage.jpg",
      } as any;
      formData.append("groupImage", file);

      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${apiConfig.BASE_URL}/api/groups/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      console.log("DATA", data);
      try {
        data = JSON.parse(responseText);
        console.log("Parsed response data:", data);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error("Invalid response format from server");
      }

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }
      if (data.imagePath) {
        console.log("Successfully got image path:", data.imagePath);
        const cleanPath = data.imagePath.replace(/\s+/g, '');
        setUploadedImageUrl(cleanPath);
        return cleanPath;
      } else {
        console.error("No fullImagePath in response data:", data);
        throw new Error("No image path in response");
      }
    } catch (error) {
      console.error("Full upload error:", error);
      Alert.alert(
        "Upload Error",
        `Failed to upload image: ${(error as Error).message}. Please try again.`
      );
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const pickImage = async () => {
    try {
      console.log("Starting image picker...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log("Image picker result:", result);

      if (!result.canceled && result.assets[0].uri) {
        console.log("Image selected, starting resize...");
        const resizedUri = await resizeImage(result.assets[0].uri);
        console.log("Image resized successfully:", resizedUri);
        setGroupImage(resizedUri);

        console.log("Starting upload process...");
        const uploadedUrl = await uploadImage(resizedUri);
        if (uploadedUrl) {
          console.log("Upload completed successfully with URL:", uploadedUrl);
        } else {
          console.log("Upload failed - no URL returned");
          setGroupImage(null);
        }
      } else {
        console.log("Image picker cancelled or no image selected");
      }
    } catch (error) {
      console.error("Error in entire pick and upload process:", error);
      Alert.alert(
        "Error",
        "Failed to process and upload image. Please try again."
      );
      setGroupImage(null);
    }
  };


  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("Token not found");
          return;
        }
        console.log("Token:", token);
        const response = await fetch(`${apiConfig.BASE_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        const data = await response.json();
        console.log("User data:", data);
        setUserId(data.id);
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };
    fetchUserId();
  }, []);
  
  

  const createGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name.");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID not found. Please log in again.");
      return;
    }

    const allMembers = [...new Set([...selectedFriends, userId])];

    if (allMembers.length === 0) {
      Alert.alert("Error", "Please select at least one friend.");
      return;
    }

    if (!uploadedImageUrl) {
      Alert.alert("Error", "Please upload a group image before proceeding.");
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const payload = {
        name: groupName.trim(),
        description: groupDescription.trim(),
        members: allMembers,
        groupImageUrl: uploadedImageUrl,
      };

      const response = await fetch(`${apiConfig.BASE_URL}/api/groups/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create group");
      }

      const data: GroupCreateResponse = await response.json();
      Alert.alert("Success", "Group created successfully!", [
        { text: "OK", onPress: () => router.push({ pathname: `./chat/${data.group.id}` }) },
      ]);
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Error", "Failed to create group. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={GlobalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
      <TouchableOpacity
        onPress={pickImage}
        style={GlobalStyles.imagePicker}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : groupImage ? (
          <Image source={{ uri: groupImage }} style={GlobalStyles.groupImage} />
        ) : (
          <Text style={GlobalStyles.imagePlaceholderText}>Upload Group Image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Group Name"
        placeholderTextColor="#AAA"
        value={groupName}
        onChangeText={setGroupName}
        maxLength={50}
      />

      <TextInput
        style={[GlobalStyles.input, GlobalStyles.textArea]}
        placeholder="Group Description (Optional)"
        placeholderTextColor="#AAA"
        value={groupDescription}
        onChangeText={setGroupDescription}
        multiline
        maxLength={200}
      />

      <Text style={GlobalStyles.sectionTitle}>
        Select Friends ({selectedFriends.length} selected)
      </Text>

      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              GlobalStyles.friendItem,
              selectedFriends.includes(item.id) && GlobalStyles.friendItemSelected,
            ]}
            onPress={() => toggleSelectFriend(item.id)}
          >
            <Image
              source={
                item.profile_image
                  ? { uri: `${apiConfig.BASE_URL}${item.profile_image}` }
                  : require("../assets/default-profile.png")
              }
              style={GlobalStyles.profileImage}
            />
            <Text style={GlobalStyles.friendName}>{item.name || "No Name"}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={GlobalStyles.friendList}
      />

      <TouchableOpacity
        style={[
          GlobalStyles.createButton,
          (!groupName.trim() || selectedFriends.length === 0) &&
          GlobalStyles.createButtonDisabled,
        ]}
        onPress={createGroup}
        disabled={!groupName.trim() || selectedFriends.length === 0 || isLoading}
      >
        <Text style={GlobalStyles.buttonText}>
          {isLoading ? "Creating..." : "Create Group"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GroupCreation;

