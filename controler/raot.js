import jwt from 'jsonwebtoken';
import express from 'express';
import dbFun from '../model/dbFun.js';
import sendGmail from "../model/gmail.js";
const raot = express.Router();

raot.get('/', (req, res) => {
  if (req.session.user && req.session.user.user.USER_TYPE) {
    switch (req.session.user.user.USER_TYPE) {
      case 'STUDENT':
        return res.redirect('/student');
      case 'TEACHER':
        return res.redirect('/teacher');
      case 'Management':
        return res.redirect('/Management');
      default:
        return res.render('login', { error: 'גישה נדחתה' });
    }
  } else {
    return res.render('login', { error: 'אנא התחבר מחדש' });
  }
});

raot.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const queryUser = `SELECT * FROM USERS WHERE USER_NAME = '${username}'`;
  const users = await dbFun.get_data(queryUser);

  if (users.length === 0) {
    return res.render('login', { error: 'שם משתמש לא קיים' });
  }

  const user = users[0];

  if (password === user.PASSWORD) {
    const token = jwt.sign({ user }, '#ookmcvk7t', { expiresIn: '1h' });
    res.cookie('accessToken', token, { httpOnly: true, maxAge: 3600000 });
    req.session.user = { user };
    return res.redirect('/');
  } else {
    return res.render('login', { error: 'הסיסמה שגויה' });
  }
});

raot.get('/logout', (req, res) => {
  res.clearCookie('accessToken');
  req.session.destroy();
  res.redirect('/');
});

raot.get('/Management', (req, res) => {
  res.render('Management/index');
});
raot.get('/course/:id', async (req, res) => {
  const courseId = req.params.id;
  const studentId = req.session.user && req.session.user.user && req.session.user.user.ID_STUDENT;

  try {
    const courseQuery = `SELECT * FROM COURSE WHERE ID_COURSE = ${courseId}`;
    const homeworksQuery = `SELECT * FROM HOMEWORK WHERE ID_COURSE = ${courseId}`;
    const materialsQuery = `SELECT * FROM MATERIAL WHERE ID_COURSE = ${courseId}`;

    const course = await dbFun.get_data(courseQuery);
    const homeworks = await dbFun.get_data(homeworksQuery);
    const materials = await dbFun.get_data(materialsQuery);

    res.render("course", { course: course[0], homeworks, materials, studentId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



// نقطة نهاية لصفحة "שכחתי סיסמה"
raot.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { error: null, success: null });
});

// معالجة طلب "שכחתי סיסמה"
raot.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.render('forgot-password', { error: 'יש להזין כתובת מייל', success: null });
  }

  try {
    const checkQuery = `SELECT * FROM USERS WHERE USER_NAME = '${email}'`;
    const user = await dbFun.get_data(checkQuery);

    if (user && user.length > 0) {
      // إنشاء كود تحقق عشوائي مكون من 6 أرقام
      const randomCode = Math.floor(100000 + Math.random() * 900000);

      // تخزين البريد الإلكتروني وكود التحقق في الجلسة
      req.session.email = email;
      req.session.verificationCode = randomCode;
       await sendGmail(randomCode, email);
      // إرجاع الاستجابة
      res.render('verify-code.ejs', { email,success: 'קוד אימות נשלח למייל שלך', error: null });
    } else {
      res.render('forgot-password', { error: 'המייל לא קיים במערכת', success: null });
    }
  } catch (error) {
    console.error('حدث خطأ:', error);
    res.render('forgot-password', { error: 'שגיאה בשליחת המייל', success: null });
  }
});

raot.post('/verify-code', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.render('forgot-password', { error: 'יש להזין קוד אימות', success: null });
  }

  // التحقق من صحة الكود
  if (code == req.session.verificationCode) { // استخدم == بدلاً من === لأن الكود قد يكون نصًا أو رقمًا
    // الكود صحيح، قم بتوجيه المستخدم لتغيير كلمة المرور
    res.render('change-password', {error:null,success: null , email: req.session.email });
  } else {
    res.render('verify-code.ejs', { error: 'קוד אימות לא תקין', success: null , email: req.session.email });
  }
});
raot.post('/change-password', async (req, res) => {

  const {  newPassword, confirmPassword } = req.body;
  const email= req.session.email;   
  if (!email || !newPassword || !confirmPassword) {
  }

  if (newPassword !== confirmPassword) {
    return res.render('change-password', { error: 'הסיסמאות לא תואמות', success: null });
  }

  try {
    // עדכון הסיסמה במסד הנתונים
    const updateQuery = `UPDATE USERS SET PASSWORD = '${newPassword}' WHERE USER_NAME = '${email}'`;
    await dbFun.updateData(updateQuery);

    // ניקוי הנתונים מהגישה
    delete req.session.email;
    delete req.session.verificationCode;

    // הפנייה לדף ההתחברות עם הודעת הצלחה
    return res.render('login', { error: 'הסיסמה השתנתה בהצלחה', success: null });
  } catch (error) {
    console.error('שגיאה:', error);
    res.render('change-password', { error: 'שגיאה בעדכון הסיסמה', success: null });
  }
});
export default raot;
