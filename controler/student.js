import dbFun from "../model/dbFun.js";
import express from "express";
import authenticate from "./auth.js";

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const id_student = req.session.user && req.session.user.user && req.session.user.user.ID_STUDENT;
    if (!id_student) {
      return res.status(400).send("Invalid student ID");
    }

    // جلب اسم الطالب
    const studentNameQuery = `SELECT NAME_STUDENT FROM STUDENT WHERE ID_ = ${id_student};`;
    
    // جلب الكورسات التي سجل فيها الطالب
    const courseQuery = `
      SELECT COURSE.Name_Course, COURSE.infromation,COURSE.ID_COURSE 
      FROM COURSE
      JOIN REGISTRATION_FOR_COURSE ON COURSE.ID_COURSE = REGISTRATION_FOR_COURSE.ID_COURSE
      WHERE REGISTRATION_FOR_COURSE.ID_STUDENT = ${id_student};
    `;

    // جلب الجدول الأسبوعي للدروس المرتبطة بالكورسات التي سجل فيها الطالب
    const scheduleQuery = `
      SELECT COURSE.Name_Course, LESSON.LESSON_DATE, LESSON.start_time, LESSON.end_time
      FROM REGISTRATION_FOR_COURSE
      JOIN COURSE ON REGISTRATION_FOR_COURSE.ID_COURSE = COURSE.ID_COURSE
      LEFT JOIN LESSON ON COURSE.ID_COURSE = LESSON.ID_COURSE
      WHERE REGISTRATION_FOR_COURSE.ID_STUDENT = ${id_student}
      ORDER BY LESSON.LESSON_DATE, LESSON.start_time;
    `;
    
    // جلب البيانات من قاعدة البيانات
    const studentNameResult = await dbFun.get_data(studentNameQuery);
    const studentName = studentNameResult.length ? studentNameResult[0].NAME_STUDENT : "Student";
    const courses = await dbFun.get_data(courseQuery);
    const schedule = await dbFun.get_data(scheduleQuery);
    
    console.log(schedule); // اختبار النتيجة في وحدة التحكم

    res.render('student', { studentName, courses, schedule });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).send("Internal Server Error");
  }
});


export default router;