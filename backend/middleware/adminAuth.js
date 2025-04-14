import jwt from 'jsonwebtoken';
const adminAuth = async (req, res, next) => {
    try {
        // Kiểm tra token trong headers
        const { token } = req.headers;
        
        if (!token) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }

        // Nếu có token, tiếp tục xử lý
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Kiểm tra token giải mã
        console.log(token_decode); // Thêm log để xem giá trị token_decode

        // Kiểm tra quyền truy cập của admin
        if (token_decode.id !== process.env.ADMIN_ID) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
          }
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default adminAuth;
