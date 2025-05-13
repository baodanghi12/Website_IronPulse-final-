// utils/sendOrderEmail.js
import nodemailer from 'nodemailer';

const sendOrderEmail = async (userEmail, order) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // hoặc dùng SMTP của provider khác
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

const mailOptions = {
  from: '"Iron Pulse" <your-email@example.com>',
  to: userEmail,
  subject: '🧾 Xác Nhận Đơn Hàng của Bạn tại Iron Pulse',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f8f8f8; border-radius: 10px; border: 1px solid #ddd;">
      <h2 style="font-size: 24px; color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; text-align: center;">🛒 Cảm ơn bạn đã đặt hàng!</h2>
      
      <p style="font-size: 16px; color: #555;">Chúng tôi đã nhận được đơn hàng của bạn và sẽ xử lý sớm. Dưới đây là chi tiết đơn hàng:</p>

      <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #34495e;">🆔 Mã Đơn Hàng:</td>
          <td style="padding: 10px; color: #2c3e50;">${order._id}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #34495e;">💵 Tổng Tiền:</td>
          <td style="padding: 10px; color: #2c3e50;">₫ ${order.amount.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #34495e;">📦 Trạng Thái:</td>
          <td style="padding: 10px; color: #2c3e50;">${order.payment ? "Đã Thanh Toán" : "Chờ Xử Lý"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #34495e;">💳 Phương Thức Thanh Toán:</td>
          <td style="padding: 10px; color: #2c3e50;">${order.paymentMethod === 'COD' ? "Thanh Toán Khi Nhận Hàng (COD)" : order.paymentMethod}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #34495e;">🚚 Giao Hàng Tới:</td>
          <td style="padding: 10px; color: #2c3e50;">
            ${order.address.firstName} ${order.address.lastName}<br/>
            ${order.address.street}, ${order.address.city}, ${order.address.state} ${order.address.zipcode}<br/>
            ${order.address.country}<br/>
            📞 ${order.address.phone}
          </td>
        </tr>
      </table>

      <!-- Thêm chi tiết sản phẩm -->
      <h3 style="font-size: 20px; color: #34495e; margin-top: 30px;">🛍️ Chi Tiết Đơn Hàng</h3>
      <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
        ${order.items.map(item => `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; width: 30%;"><img src="${item.productImage}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover;"></td>
            <td style="padding: 10px; font-weight: bold; color: #2c3e50;">${item.name}</td>
            <td style="padding: 10px; color: #2c3e50;">₫ ${item.price.toLocaleString()}</td>
            <td style="padding: 10px; color: #2c3e50;">Số Lượng: ${item.quantity}</td>
            <td style="padding: 10px; color: #2c3e50;">₫ ${(item.price * item.quantity).toLocaleString()}</td>
          </tr>
        `).join('')}
      </table>

      <p style="font-size: 16px; color: #555; margin-top: 20px;">📍 Chúng tôi sẽ liên hệ với bạn để xác nhận giao hàng. Cảm ơn bạn đã mua sắm tại <strong>Iron Pulse</strong>! 💪</p>
      <p style="color: #888; font-size: 12px;">Nếu bạn không thực hiện giao dịch này, vui lòng liên hệ ngay với chúng tôi.</p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="http://localhost:5173/" style="padding: 10px 20px; background-color: #1abc9c; color: #fff; text-decoration: none; border-radius: 5px;">Truy Cập Cửa Hàng</a>
      </div>
    </div>
  `
};


        await transporter.sendMail(mailOptions);
        console.log('Order email sent to', userEmail);
    } catch (error) {
        console.error('Failed to send order email:', error);
    }
};

export default sendOrderEmail;
