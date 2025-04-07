// const jwt = require('jsonwebtoken'); // Import jwt
// const { default: LogModel } = require('../models/LogModel');
// require('dotenv').config(); // Đảm bảo bạn đã cấu hình dotenv để sử dụng biến môi trường

// const logMiddleware = async (req, res, next) => {
//     const headers = req.headers;
//     const authorization = headers.authorization;
//     const token = authorization?.split('Bearer ')[1]; // Lấy token từ header Authorization

//     let email = '';
//     if (token) {
//         try {
//             const verifyToken = jwt.verify(token, process.env.SECRET_Key); // Xác thực token
//             email = verifyToken.email || ''; // Lấy email từ payload của token
//         } catch (error) {
//             console.error('Token verification failed:', error.message);
//         }
//     }

//     // ai, lam gi, luc nao
//     const data = {
//         email,
//         method: req.method,
//         url: req.url,
//     };
//     try {
//         if(!req.url.includes('/logs')){
//             await LogModel.create(data);
//         }
//         next();
//     } catch (error) {
//         throw new Error (error.message);
//     }
// };

// const saveLog = async (data) => {
//     try {
//         await LogModel.create(data); // Lưu log vào cơ sở dữ liệu
//         return 'oke';
//     } catch (error) {
//         throw new Error(error.message); // Xử lý lỗi nếu có
//     }
// };

// module.exports = {  saveLog };
// // logMiddleware,