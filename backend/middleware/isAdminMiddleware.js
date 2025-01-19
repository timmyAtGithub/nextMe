const isAdmin = (req, res, next) => {
    console.log('Checking admin status:', req.user, req.user.username);
    if (req.user && req.user.username === 'Admin') {
      console.log('Admin access granted:', req.user.username);
      next();
    } else {
      console.log('Admin access denied:', req.user ? req.user.username : 'No user');
      res.status(403).json({ message: 'Access denied: You are not an admin' });
    }
  };
  
  module.exports = isAdmin;
  