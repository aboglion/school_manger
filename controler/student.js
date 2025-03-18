import dbFun from "../model/dbFun.js";
import express from "express";
import authenticate from "./auth.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
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

router.get('/', async (req, res) => {
  try {
    const id_student = req.session.user && req.session.user.user && req.session.user.user.ID_STUDENT;
    if (!id_student) {
      return res.status(400).send("Invalid student ID");
    }

    // Get student name
    const studentNameQuery = `SELECT NAME_STUDENT FROM STUDENT WHERE ID_ = ${id_student};`;
    
    // Get courses the student is registered for
    const courseQuery = `
      SELECT COURSE.Name_Course, COURSE.infromation, COURSE.ID_COURSE
      FROM COURSE
      JOIN REGISTRATION_FOR_COURSE ON COURSE.ID_COURSE = REGISTRATION_FOR_COURSE.ID_COURSE
      WHERE REGISTRATION_FOR_COURSE.ID_STUDENT = ${id_student};
    `;

    // Get weekly schedule for courses the student is registered for
    const scheduleQuery = `
      SELECT COURSE.Name_Course, LESSON.LESSON_DATE, LESSON.start_time, LESSON.end_time, LESSON.ID_LESSON
      FROM REGISTRATION_FOR_COURSE
      JOIN COURSE ON REGISTRATION_FOR_COURSE.ID_COURSE = COURSE.ID_COURSE
      LEFT JOIN LESSON ON COURSE.ID_COURSE = LESSON.ID_COURSE
      WHERE REGISTRATION_FOR_COURSE.ID_STUDENT = ${id_student}
      ORDER BY LESSON.LESSON_DATE, LESSON.start_time;
    `;
    
    // Get homework assignments for the student's courses
    const homeworkQuery = `
      SELECT H.ID_HOMEWORK, H.HOMEWORKLBL, H.DEADLINE, C.Name_Course, C.ID_COURSE,
             HS.ID_SUBMISSION, HS.SUBMISSION_DATE, HS.MARKS_RECEIVED, L.ID_LESSON
      FROM HOMEWORK H
      JOIN COURSE C ON H.ID_COURSE = C.ID_COURSE
      JOIN REGISTRATION_FOR_COURSE RFC ON C.ID_COURSE = RFC.ID_COURSE
      JOIN LESSON L ON C.ID_COURSE = L.ID_COURSE
      LEFT JOIN HOMEWORK_SUBMISSION HS ON L.ID_LESSON = HS.ID_LESSON AND HS.ID_STUDENT = ${id_student}
      WHERE RFC.ID_STUDENT = ${id_student}
      ORDER BY H.DEADLINE;
    `;

    // Get attendance records
    const attendanceQuery = `
      SELECT A.PRESENT, L.LESSON_DATE, C.Name_Course
      FROM ATTENDANCE A
      JOIN LESSON L ON A.ID_LESSON = L.ID_LESSON
      JOIN COURSE C ON L.ID_COURSE = C.ID_COURSE
      WHERE A.ID_STUDENT = ${id_student}
      ORDER BY L.LESSON_DATE DESC;
    `;
    
    // Get data from database
    const studentNameResult = await dbFun.get_data(studentNameQuery);
    const studentName = studentNameResult.length ? studentNameResult[0].NAME_STUDENT : "Student";
    const courses = await dbFun.get_data(courseQuery);
    const schedule = await dbFun.get_data(scheduleQuery);
    const homeworks = await dbFun.get_data(homeworkQuery);
    const attendance = await dbFun.get_data(attendanceQuery);
    
    // Check for schedule conflicts
    const conflicts = findScheduleConflicts(schedule);

    res.render('student', {
      studentName,
      courses,
      schedule,
      homeworks,
      attendance,
      conflicts
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Function to find schedule conflicts
function findScheduleConflicts(schedule) {
  const conflicts = [];
  
  for (let i = 0; i < schedule.length; i++) {
    for (let j = i + 1; j < schedule.length; j++) {
      const lesson1 = schedule[i];
      const lesson2 = schedule[j];
      
      // Check if lessons are on the same day
      if (lesson1.LESSON_DATE === lesson2.LESSON_DATE) {
        // Parse times to compare
        const start1 = new Date(`2000-01-01T${lesson1.start_time}`);
        const end1 = new Date(`2000-01-01T${lesson1.end_time}`);
        const start2 = new Date(`2000-01-01T${lesson2.start_time}`);
        const end2 = new Date(`2000-01-01T${lesson2.end_time}`);
        
        // Check for overlap
        if ((start1 <= end2 && start2 <= end1)) {
          conflicts.push({
            date: lesson1.LESSON_DATE,
            course1: lesson1.Name_Course,
            time1: `${lesson1.start_time} - ${lesson1.end_time}`,
            course2: lesson2.Name_Course,
            time2: `${lesson2.start_time} - ${lesson2.end_time}`
          });
        }
      }
    }
  }
  
  return conflicts;
}

router.get('/course/:id', async (req, res) => {
  const courseId = req.params.id;
  const studentId = req.session.user && req.session.user.user && req.session.user.user.ID_STUDENT;

  try {
    // Check if student is registered for this course
    const registrationQuery = `
      SELECT * FROM REGISTRATION_FOR_COURSE
      WHERE ID_STUDENT = ${studentId} AND ID_COURSE = ${courseId}
    `;
    const registration = await dbFun.get_data(registrationQuery);
    
    if (registration.length === 0) {
      return res.status(403).send("You are not registered for this course");
    }

    const courseQuery = `SELECT * FROM COURSE WHERE ID_COURSE = ${courseId}`;
    const homeworksQuery = `
      SELECT H.*, HS.ID_SUBMISSION, HS.SUBMISSION_DATE, HS.FILE_NAME, HS.MARKS_RECEIVED, L.ID_LESSON
      FROM HOMEWORK H
      JOIN LESSON L ON H.ID_COURSE = L.ID_COURSE
      LEFT JOIN HOMEWORK_SUBMISSION HS ON L.ID_LESSON = HS.ID_LESSON AND HS.ID_STUDENT = ${studentId}
      WHERE H.ID_COURSE = ${courseId}
      ORDER BY H.DEADLINE
    `;
    const materialsQuery = `SELECT * FROM MATERIAL WHERE ID_COURSE = ${courseId}`;
    const lessonsQuery = `
      SELECT * FROM LESSON
      WHERE ID_COURSE = ${courseId}
      ORDER BY LESSON_DATE, start_time
    `;

    const course = await dbFun.get_data(courseQuery);
    const homeworks = await dbFun.get_data(homeworksQuery);
    const materials = await dbFun.get_data(materialsQuery);
    const lessons = await dbFun.get_data(lessonsQuery);

    res.render("course", {
      course: course[0],
      homeworks,
      materials,
      studentId,
      lessons
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/submit-homework', upload.single('file'), async (req, res) => {
  const { homeworkId } = req.body;
  const studentId = req.session.user && req.session.user.user && req.session.user.user.ID_STUDENT;
  const file = req.file;

  if (!homeworkId || !studentId || !file) {
    return res.status(400).send("Missing required information");
  }

  try {
    // Get lesson ID for this homework
    const lessonQuery = `
      SELECT ID_LESSON FROM LESSON
      WHERE ID_COURSE = (SELECT ID_COURSE FROM HOMEWORK WHERE ID_HOMEWORK = ${homeworkId})
      LIMIT 1
    `;
    const lessonResult = await dbFun.get_data(lessonQuery);
    
    if (lessonResult.length === 0) {
      return res.status(400).send("No lesson found for this homework");
    }
    
    const lessonId = lessonResult[0].ID_LESSON;
    
    // Check if student has already submitted this homework
    const checkQuery = `
      SELECT * FROM HOMEWORK_SUBMISSION
      WHERE ID_LESSON = ${lessonId} AND ID_STUDENT = ${studentId}
    `;
    const existingSubmission = await dbFun.get_data(checkQuery);
    
    if (existingSubmission.length > 0) {
      // Update existing submission
      const updateQuery = `
        UPDATE HOMEWORK_SUBMISSION
        SET SUBMISSION_DATE = DATE('now'), FILE_NAME = '${file.filename}', MARKS_RECEIVED = NULL
        WHERE ID_LESSON = ${lessonId} AND ID_STUDENT = ${studentId}
      `;
      await dbFun.updateData(updateQuery);
    } else {
      // Create new submission
      const insertQuery = `
        INSERT INTO HOMEWORK_SUBMISSION (ID_STUDENT, ID_LESSON, SUBMISSION_DATE, FILE_NAME)
        VALUES (${studentId}, ${lessonId}, DATE('now'), '${file.filename}')
      `;
      await dbFun.updateData(insertQuery);
    }
    
    res.redirect(`/student/course/${req.body.courseId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/attendance-history', async (req, res) => {
  const studentId = req.session.user && req.session.user.user && req.session.user.user.ID_STUDENT;
  
  try {
    const attendanceQuery = `
      SELECT A.PRESENT, L.LESSON_DATE, C.Name_Course
      FROM ATTENDANCE A
      JOIN LESSON L ON A.ID_LESSON = L.ID_LESSON
      JOIN COURSE C ON L.ID_COURSE = C.ID_COURSE
      WHERE A.ID_STUDENT = ${studentId}
      ORDER BY L.LESSON_DATE DESC
    `;
    
    const attendance = await dbFun.get_data(attendanceQuery);
    const studentNameQuery = `SELECT NAME_STUDENT FROM STUDENT WHERE ID_ = ${studentId}`;
    const studentNameResult = await dbFun.get_data(studentNameQuery);
    const studentName = studentNameResult.length ? studentNameResult[0].NAME_STUDENT : "Student";
    
    res.render('attendance-history', { attendance, studentName });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;