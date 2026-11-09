import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Cấu hình SMTP (Thay thế bằng thông tin email thực tế của VPEM hoặc Google App Password)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL || 'your-email@gmail.com', // Đặt biến môi trường trong file .env
        pass: process.env.SMTP_PASSWORD || 'your-app-password',
      },
    });

    // Nội dung Email gửi về hệ thống cskh@vpem.vn
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: 'cskh@vpem.vn', 
      subject: `[VPEM WEB] Có liên hệ mới từ ${name}`,
      html: `
        <h2 style="color: #FF6C0E;">Bạn có một yêu cầu liên hệ mới từ website VPEM</h2>
        <p><strong>Khách hàng / Đối tác:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Số điện thoại:</strong> ${phone || 'Không cung cấp'}</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p><strong>Nội dung:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email đã được gửi thành công' }, { status: 200 });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    return NextResponse.json({ success: false, message: 'Không thể gửi email' }, { status: 500 });
  }
}