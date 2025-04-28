import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
  
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized, token missing' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      req.userId = decoded.id;
      next();
    } catch (error) {
      console.error('Auth Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not Authorized' });
    }
  };
  
export default authUser