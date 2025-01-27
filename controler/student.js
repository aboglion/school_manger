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

    const courseQuery = `
      SELECT COURSE.*
      FROM COURSE
      JOIN REGISTRATION_FOR_COURSE ON COURSE.ID_COURSE = REGISTRATION_FOR_COURSE.ID_COURSE
      WHERE REGISTRATION_FOR_COURSE.ID_STUDENT = ${id_student};
    `;
    const studentNameQuery = `SELECT NAME_STUDENT FROM STUDENT WHERE ID_ = ${id_student}`;
    const scheduleQuery = `
      SELECT COURSE.Name_Course, LESSON.LESSON_DATE, LESSON.start_time, LESSON.end_time
      FROM LESSON
      JOIN COURSE ON LESSON.ID_COURSE = COURSE.ID_COURSE
      WHERE COURSE.ID_COURSE IN (SELECT ID_COURSE FROM REGISTRATION_FOR_COURSE WHERE ID_STUDENT = ${id_student})
      ORDER BY LESSON.LESSON_DATE, LESSON.start_time;
    `;

    const studentNameResult = await dbFun.get_data(studentNameQuery);
    const studentName = studentNameResult.length ? studentNameResult[0].NAME_STUDENT : "Student";
    const courses = await dbFun.get_data(courseQuery);
    const schedule = await dbFun.get_data(scheduleQuery);

    res.render('student', { studentName, courses, schedule });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/course/:id', async (req, res) => {
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

export default router;
