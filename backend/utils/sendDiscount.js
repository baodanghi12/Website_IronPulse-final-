import nodemailer from 'nodemailer';

export const sendDiscountCode = async (req, res) => {
  const { name, email } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: 'Name and Email are required' });
  }

  try {
    // Khởi tạo transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Nội dung email
    const mailOptions = {
      from: `"Your Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Mã giảm giá dành riêng cho bạn!',
      html: `
        <p>Xin chào ${name},</p>
        <p>Cảm ơn bạn đã đăng ký. Đây là mã giảm giá đặc biệt dành cho bạn:</p>
        <h2>SALE2025</h2>
        <p>Áp dụng khi mua hàng tại website của chúng tôi.</p>
        <p>Trân trọng,<br/>Your Shop Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Discount code sent successfully!' });
  } catch (error) {
    console.error('Send discount error:', error);
    res.status(500).json({ message: 'Failed to send discount code' });
  }
};
