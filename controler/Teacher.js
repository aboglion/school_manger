import express from 'express';
import authenticate, { isTeacher } from './auth.js';
import dbFun from '../model/dbFun.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

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
    const lessonsQuery = `SELECT LESSON.ID_LESSON, LESSON.LESSON_DATE, COURSE.Name_Course, COURSE.ID_COURSE
                         FROM LESSON
                         JOIN COURSE ON LESSON.ID_COURSE = COURSE.ID_COURSE
                         WHERE COURSE.ID_TEACHER = ${teacherId}
                         ORDER BY LESSON.LESSON_DATE DESC`;
    const homeworksQuery = `SELECT HOMEWORK.*, COURSE.Name_Course
                           FROM HOMEWORK
                           JOIN COURSE ON HOMEWORK.ID_COURSE = COURSE.ID_COURSE
                           WHERE COURSE.ID_TEACHER = ${teacherId}`;
    const submissionsQuery = `SELECT HS.*, S.NAME_STUDENT, H.HOMEWORKLBL, C.Name_Course
                              FROM HOMEWORK_SUBMISSION HS
                              JOIN STUDENT S ON HS.ID_STUDENT = S.ID_
                              JOIN LESSON L ON HS.ID_LESSON = L.ID_LESSON
                              JOIN COURSE C ON L.ID_COURSE = C.ID_COURSE
                              JOIN HOMEWORK H ON C.ID_COURSE = H.ID_COURSE
                              WHERE C.ID_TEACHER = ${teacherId}
                              AND HS.MARKS_RECEIVED IS NULL
                              ORDER BY HS.SUBMISSION_DATE DESC`;

    const students = await dbFun.get_data(studentsQuery);
    const courses = await dbFun.get_data(coursesQuery);
    const lessons = await dbFun.get_data(lessonsQuery);
    const homeworks = await dbFun.get_data(homeworksQuery);
    const pendingSubmissions = await dbFun.get_data(submissionsQuery);

    // Get schedule for teacher
    const scheduleQuery = `
      SELECT LESSON.ID_LESSON, LESSON.LESSON_DATE, LESSON.start_time, LESSON.end_time,
             COURSE.Name_Course, COURSE.ID_COURSE
      FROM LESSON
      JOIN COURSE ON LESSON.ID_COURSE = COURSE.ID_COURSE
      WHERE COURSE.ID_TEACHER = ${teacherId}
      ORDER BY LESSON.LESSON_DATE, LESSON.start_time`;
    
    const schedule = await dbFun.get_data(scheduleQuery);

    res.render("teacher", {
      teacherName: req.session.user.user.NAME_TEACHER,
      students,
      courses,
      lessons,
      homeworks,
      pendingSubmissions,
      schedule
    });
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
      const query = `INSERT INTO MATERIAL (ID_COURSE, FILE_NAME) VALUES (${courseId}, '${file.filename}')`;
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

router.post('/create-homework', async (req, res) => {
  const { courseId, homeworkTitle, deadline } = req.body;
  try {
    const query = `INSERT INTO HOMEWORK (ID_COURSE, HOMEWORKLBL, DEADLINE)
                  VALUES (${courseId}, '${homeworkTitle}', '${deadline}')`;
    await dbFun.updateData(query);
    res.status(200).json({ message: 'Homework created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/grade-homework', async (req, res) => {
  const { submissionId, grade } = req.body;
  try {
    const query = `UPDATE HOMEWORK_SUBMISSION
                  SET MARKS_RECEIVED = ${grade}
                  WHERE ID_SUBMISSION = ${submissionId}`;
    await dbFun.updateData(query);
    res.status(200).json({ message: 'Homework graded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/mark-attendance', async (req, res) => {
  const { lessonId, attendance } = req.body;
  try {
    const promises = Object.entries(attendance).map(([studentId, present]) => {
      const query = `
        INSERT INTO ATTENDANCE (ID_STUDENT, ID_LESSON, DATE, PRESENT)
        VALUES (${studentId}, ${lessonId}, DATE('now'), ${present})
        ON CONFLICT(ID_LESSON, ID_STUDENT) DO UPDATE SET PRESENT = ${present}`;
      return dbFun.updateData(query);
    });
    await Promise.all(promises);
    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/view-submissions/:homeworkId', async (req, res) => {
  const homeworkId = req.params.homeworkId;
  try {
    const submissionsQuery = `
      SELECT HS.*, S.NAME_STUDENT, H.HOMEWORKLBL
      FROM HOMEWORK_SUBMISSION HS
      JOIN STUDENT S ON HS.ID_STUDENT = S.ID_
      JOIN LESSON L ON HS.ID_LESSON = L.ID_LESSON
      JOIN COURSE C ON L.ID_COURSE = C.ID_COURSE
      JOIN HOMEWORK H ON C.ID_COURSE = H.ID_COURSE
      WHERE H.ID_HOMEWORK = ${homeworkId}`;
    
    const submissions = await dbFun.get_data(submissionsQuery);
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/download-submission/:submissionId', async (req, res) => {
  const submissionId = req.params.submissionId;
  try {
    const submissionQuery = `
      SELECT * FROM HOMEWORK_SUBMISSION
      WHERE ID_SUBMISSION = ${submissionId}`;
    
    const submissions = await dbFun.get_data(submissionQuery);
    if (submissions.length === 0) {
      return res.status(404).send('Submission not found');
    }
    
    const submission = submissions[0];
    const filePath = path.join('public/uploads/', submission.FILE_NAME);
    
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).send('File not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
