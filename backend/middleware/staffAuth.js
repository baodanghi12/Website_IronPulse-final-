import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';  // Import model user để kiểm tra quyền của người dùng trong DB

const staffAuth = async (req, res, next) => {
    try {
        // Kiểm tra token trong headers
        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
        }

        // Nếu có token, giải mã token để lấy thông tin người dùng
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Lấy thông tin người dùng từ DB dựa trên ID giải mã từ token
        const user = await userModel.findById(token_decode.id);
        
        // Kiểm tra xem người dùng có phải là staff hay không
        if (!user || user.role !== 'staff') {
            return res.status(403).json({ success: false, message: "Not Authorized Login Again" });
        }

        // Lưu thông tin người dùng vào request để các middleware khác có thể sử dụng
        req.user = user;
        
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export default staffAuth;
