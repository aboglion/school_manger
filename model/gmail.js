import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import validator from 'validator';
const { isEmail } = validator;

dotenv.config();

const app = express();
app.use(express.json());

// دالة لإرسال البريد الإلكتروني
async function sendGmail(message, email) {
  if (!email || !isEmail(email)) {
    throw new Error('البريد الإلكتروني غير صالح');
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // استخدام متغير البيئة
        pass: process.env.GMAIL_PASS, // استخدام متغير البيئة
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER, // استخدام متغير البيئة
      to: email,
      subject: 'الكود العشوائي الخاص بك',
      text: `مرحبًا، ${message}`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'تم إرسال البريد الإلكتروني بنجاح' };
  } catch (error) {
    console.error('خطأ أثناء إرسال البريد:', error);
    throw new Error('فشل في إرسال البريد الإلكتروني');
  }
}



export default sendGmail;