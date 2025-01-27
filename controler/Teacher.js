import express from 'express';
import authenticate, { isTeacher } from './auth.js';
import dbFun from '../model/dbFun.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const upload = multer({ dest: 'public/uploads/' });

router.use(authenticate);
router.use(isTeacher);

router.get('/', async (req, res) => {
  try {
    const teacherId = req.session.user && req.session.user.user && req.session.user.user.ID_TEACHER;

    if (!teacherId) {
      return res.status(400).send("Teacher ID not found");
    }

    const studentsQuery = `SELECT * FROM STUDENT`;
    const coursesQuery = `SELECT * FROM COURSE WHERE ID_TEACHER = ${teacherId}`;
    const lessonsQuery = `SELECT LESSON.ID_LESSON, LESSON.LESSON_DATE, COURSE.Name_Course FROM LESSON JOIN COURSE ON LESSON.ID_COURSE = COURSE.ID_COURSE WHERE COURSE.ID_TEACHER = ${teacherId}`;

    const students = await dbFun.get_data(studentsQuery);
    const courses = await dbFun.get_data(coursesQuery);
    const lessons = await dbFun.get_data(lessonsQuery);

    res.render("teacher", { teacherName: req.session.user.user.NAME_TEACHER, students, courses, lessons });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/upload-material', upload.single('file'), async (req, res) => {
  const { courseId, fileType } = req.body;
  const file = req.file;
  try {
    if (fileType === 'homework') {
      const query = `INSERT INTO HOMEWORK (ID_COURSE, HOMEWORKLBL, DEADLINE) VALUES (${courseId}, '${file.filename}', '2024-12-31')`;
      await dbFun.updateData(query);
    } else {
      const query = `INSERT INTO MATERIAL (ID_COURSE, FILE_NAME) VALUES (${courseId}, '${file.filename}')`;
      await dbFun.updateData(query);
    }
    res.status(200).redirect('/teacher');
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/mark-attendance', async (req, res) => {
  const { lessonId, attendance } = req.body;
  try {
    const promises = Object.entries(attendance).map(([studentId, present]) => {
      const query = `
        INSERT INTO ATTENDANCE (ID_STUDENT, ID_LESSON, DATE, PRESENT)
        VALUES (${studentId}, ${lessonId}, DATE('now'), ${present})
        ON CONFLICT(ID_STUDENT, ID_LESSON, DATE) DO UPDATE SET PRESENT = ${present}`;
      return dbFun.updateData(query);
    });
    await Promise.all(promises);
    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
