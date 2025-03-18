import sqlite3 from 'sqlite3';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database
const db = new sqlite3.Database('mydata.db');

// Function to execute SQL queries
function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        console.error('Error executing query:', err);
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

// Function to get data from the database
function getData(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Error getting data:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Function to generate a random date between start and end
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to format date as YYYY-MM-DD
function formatDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

// Function to generate a random time between start and end hours
function randomTime(startHour, endHour) {
  const hour = Math.floor(Math.random() * (endHour - startHour) + startHour);
  const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

// Function to generate a random boolean (0 or 1)
function randomBoolean() {
  return Math.random() > 0.2 ? 1 : 0; // 80% chance of being present
}

// Function to generate a random integer between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Sample data
const students = [
  { name: 'אדם כהן', phone: '0501234567', email: 'adam@example.com', id: 123456789 },
  { name: 'מיכל לוי', phone: '0502345678', email: 'michal@example.com', id: 234567890 },
  { name: 'יוסי אברהם', phone: '0503456789', email: 'yossi@example.com', id: 345678901 },
  { name: 'רונית שמעוני', phone: '0504567890', email: 'ronit@example.com', id: 456789012 },
  { name: 'עמית ישראלי', phone: '0505678901', email: 'amit@example.com', id: 567890123 },
  { name: 'נועה גולן', phone: '0506789012', email: 'noa@example.com', id: 678901234 },
  { name: 'דניאל פרץ', phone: '0507890123', email: 'daniel@example.com', id: 789012345 },
  { name: 'שירה אלון', phone: '0508901234', email: 'shira@example.com', id: 890123456 },
  { name: 'אורי מזרחי', phone: '0509012345', email: 'uri@example.com', id: 901234567 },
  { name: 'טליה ברק', phone: '0500123456', email: 'talia@example.com', id: 912345678 }
];

const teachers = [
  { name: 'ד"ר דוד כהן', email: 'david@example.com', phone: '0521234567', address: 'רחוב הרצל 10, תל אביב', id: 111222333 },
  { name: 'פרופ\' שרה לוי', email: 'sarah@example.com', phone: '0522345678', address: 'רחוב ביאליק 5, ירושלים', id: 222333444 },
  { name: 'מר יעקב גולדשטיין', email: 'yaakov@example.com', phone: '0523456789', address: 'רחוב וייצמן 20, חיפה', id: 333444555 },
  { name: 'גב\' רחל אברמוביץ', email: 'rachel@example.com', phone: '0524567890', address: 'רחוב רוטשילד 15, ראשון לציון', id: 444555666 },
  { name: 'ד"ר משה פרידמן', email: 'moshe@example.com', phone: '0525678901', address: 'רחוב סוקולוב 8, רמת גן', id: 555666777 }
];

const courses = [
  { name: 'מתמטיקה מתקדמת', info: 'קורס מתקדם במתמטיקה הכולל אלגברה, חשבון דיפרנציאלי ואינטגרלי', teacherId: 111222333 },
  { name: 'פיזיקה קלאסית', info: 'יסודות הפיזיקה הקלאסית, מכניקה וחשמל', teacherId: 222333444 },
  { name: 'מדעי המחשב - מבוא', info: 'מבוא לתכנות, אלגוריתמים ומבני נתונים', teacherId: 333444555 },
  { name: 'אנגלית מתקדמים', info: 'קורס אנגלית ברמה מתקדמת, דגש על כתיבה אקדמית', teacherId: 444555666 },
  { name: 'היסטוריה של המזרח התיכון', info: 'סקירה היסטורית של המזרח התיכון מהעת העתיקה ועד ימינו', teacherId: 555666777 },
  { name: 'כימיה אורגנית', info: 'יסודות הכימיה האורגנית, מבנה ותגובות של תרכובות פחמן', teacherId: 111222333 },
  { name: 'ספרות עברית מודרנית', info: 'ניתוח יצירות מרכזיות בספרות העברית המודרנית', teacherId: 222333444 },
  { name: 'סטטיסטיקה ושיטות מחקר', info: 'שיטות סטטיסטיות בסיסיות ומתקדמות למחקר', teacherId: 333444555 }
];

const classes = [
  { name: 'כיתה א\'', type: 'רגילה', seats: 30 },
  { name: 'כיתה ב\'', type: 'רגילה', seats: 30 },
  { name: 'מעבדת מחשבים', type: 'מעבדה', seats: 25 },
  { name: 'מעבדת מדעים', type: 'מעבדה', seats: 20 },
  { name: 'אולם הרצאות', type: 'אולם', seats: 100 },
  { name: 'חדר סמינרים', type: 'סמינר', seats: 15 }
];

// Main function to populate the database
async function populateDatabase() {
  try {
    console.log('Starting database population...');

    // Clear existing data
    await clearDatabase();
    
    // Add students
    console.log('Adding students...');
    for (const student of students) {
      await runQuery(
        'INSERT INTO STUDENT (NAME_STUDENT, phone, email, ID_) VALUES (?, ?, ?, ?)',
        [student.name, student.phone, student.email, student.id]
      );
    }

    // Add teachers
    console.log('Adding teachers...');
    for (const teacher of teachers) {
      await runQuery(
        'INSERT INTO TEACHER (NAME_TEACHER, GMAIL, Phone, ADDRESS, ID_) VALUES (?, ?, ?, ?, ?)',
        [teacher.name, teacher.email, teacher.phone, teacher.address, teacher.id]
      );
    }

    // Add classes
    console.log('Adding classes...');
    for (const classroom of classes) {
      await runQuery(
        'INSERT INTO CLASS (CLASS_NAME, TAYP, SEAT_NUMBER) VALUES (?, ?, ?)',
        [classroom.name, classroom.type, classroom.seats]
      );
    }

    // Add courses with dates
    console.log('Adding courses...');
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-12-31');
    
    for (const course of courses) {
      const courseStartDate = formatDate(randomDate(startDate, new Date('2025-06-30')));
      const courseEndDate = formatDate(randomDate(new Date('2025-07-01'), endDate));
      const startTime = randomTime(8, 16);
      const endTime = randomTime(parseInt(startTime.split(':')[0]) + 1, 20);
      
      await runQuery(
        'INSERT INTO COURSE (Name_Course, infromation, ID_TEACHER, start_date, start_time, end_date, end_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [course.name, course.info, course.teacherId, courseStartDate, startTime, courseEndDate, endTime]
      );
    }

    // Get the inserted courses
    const insertedCourses = await getData('SELECT * FROM COURSE');
    const insertedClasses = await getData('SELECT * FROM CLASS');

    // Assign courses to classes (CLASS_MANAGEMENT)
    console.log('Assigning courses to classes...');
    for (const course of insertedCourses) {
      // Assign each course to 1-2 random classes
      const numClasses = Math.floor(Math.random() * 2) + 1;
      const selectedClasses = [];
      
      for (let i = 0; i < numClasses; i++) {
        let randomClass;
        do {
          randomClass = insertedClasses[Math.floor(Math.random() * insertedClasses.length)];
        } while (selectedClasses.includes(randomClass.ID_CLASS));
        
        selectedClasses.push(randomClass.ID_CLASS);
        
        const dayOfWeek = Math.floor(Math.random() * 5) + 1; // 1-5 (Monday to Friday)
        const startDate = moment(course.start_date).day(dayOfWeek).format('YYYY-MM-DD');
        const startTime = randomTime(8, 16);
        const endTime = randomTime(parseInt(startTime.split(':')[0]) + 1, 20);
        
        await runQuery(
          'INSERT INTO CLASS_MANAGEMENT (ID_COURSE, ID_CLASS, start_date, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
          [course.ID_COURSE, randomClass.ID_CLASS, startDate, startTime, endTime]
        );
        
        // Create lessons for this course
        await createLessonsForCourse(course.ID_COURSE, startDate, course.end_date, dayOfWeek, startTime, endTime);
      }
    }

    // Register students for courses
    console.log('Registering students for courses...');
    for (const student of students) {
      // Register each student for 2-4 random courses
      const numCourses = Math.floor(Math.random() * 3) + 2;
      const selectedCourses = [];
      
      for (let i = 0; i < numCourses; i++) {
        let randomCourse;
        do {
          randomCourse = insertedCourses[Math.floor(Math.random() * insertedCourses.length)];
        } while (selectedCourses.includes(randomCourse.ID_COURSE));
        
        selectedCourses.push(randomCourse.ID_COURSE);
        
        await runQuery(
          'INSERT INTO REGISTRATION_FOR_COURSE (ID_COURSE, ID_STUDENT, MARK, PRESENCE) VALUES (?, ?, ?, ?)',
          [randomCourse.ID_COURSE, student.id, null, null]
        );
      }
    }

    // Get all lessons
    const lessons = await getData('SELECT * FROM LESSON');

    // Create homework assignments
    console.log('Creating homework assignments...');
    for (const course of insertedCourses) {
      // Create 2-5 homework assignments for each course
      const numHomeworks = Math.floor(Math.random() * 4) + 2;
      
      for (let i = 0; i < numHomeworks; i++) {
        const homeworkTitle = `מטלה ${i + 1} - ${course.Name_Course}`;
        const deadline = formatDate(randomDate(new Date(course.start_date), new Date(course.end_date)));
        
        await runQuery(
          'INSERT INTO HOMEWORK (ID_COURSE, HOMEWORKLBL, DEADLINE) VALUES (?, ?, ?)',
          [course.ID_COURSE, homeworkTitle, deadline]
        );
      }
    }

    // Get all homework assignments
    const homeworks = await getData('SELECT * FROM HOMEWORK');

    // Create homework submissions
    console.log('Creating homework submissions...');
    for (const student of students) {
      // Get courses this student is registered for
      const studentCourses = await getData(
        'SELECT ID_COURSE FROM REGISTRATION_FOR_COURSE WHERE ID_STUDENT = ?',
        [student.id]
      );
      
      for (const courseReg of studentCourses) {
        // Get homeworks for this course
        const courseHomeworks = homeworks.filter(hw => hw.ID_COURSE === courseReg.ID_COURSE);
        
        for (const homework of courseHomeworks) {
          // 70% chance of submitting homework
          if (Math.random() < 0.7) {
            const submissionDate = formatDate(randomDate(new Date(), new Date(homework.DEADLINE)));
            const fileName = `homework_${student.id}_${homework.ID_HOMEWORK}.pdf`;
            const grade = Math.random() < 0.8 ? randomInt(60, 100) : null; // 80% chance of being graded
            
            // Get a random lesson for this course
            const courseLessons = await getData('SELECT ID_LESSON FROM LESSON WHERE ID_COURSE = ? LIMIT 1', [homework.ID_COURSE]);
            
            if (courseLessons.length > 0) {
              await runQuery(
                'INSERT INTO HOMEWORK_SUBMISSION (ID_STUDENT, ID_LESSON, SUBMISSION_DATE, FILE_NAME, MARKS_RECEIVED) VALUES (?, ?, ?, ?, ?)',
                [student.id, courseLessons[0].ID_LESSON, submissionDate, fileName, grade]
              );
            }
          }
        }
      }
    }

    // Mark attendance for lessons
    console.log('Marking attendance...');
    for (const lesson of lessons) {
      // Get students registered for this course
      const registeredStudents = await getData(
        'SELECT ID_STUDENT FROM REGISTRATION_FOR_COURSE WHERE ID_COURSE = ?',
        [lesson.ID_COURSE]
      );
      
      for (const student of registeredStudents) {
        const present = randomBoolean();
        
        await runQuery(
          'INSERT INTO ATTENDANCE (ID_STUDENT, ID_LESSON, DATE, PRESENT) VALUES (?, ?, ?, ?)',
          [student.ID_STUDENT, lesson.ID_LESSON, lesson.LESSON_DATE, present]
        );
      }
    }

    // Create user accounts
    console.log('Creating user accounts...');
    
    // Create student accounts
    for (const student of students) {
      const password = `student${student.id.toString().slice(-4)}`;
      
      await runQuery(
        'INSERT INTO USERS (ID_STUDENT, ID_TEACHER, USER_NAME, PASSWORD, BLOCKED, USER_TYPE) VALUES (?, NULL, ?, ?, ?, ?)',
        [student.id, student.email, password, false, 'STUDENT']
      );
    }
    
    // Create teacher accounts
    for (const teacher of teachers) {
      const password = `teacher${teacher.id.toString().slice(-4)}`;
      
      await runQuery(
        'INSERT INTO USERS (ID_STUDENT, ID_TEACHER, USER_NAME, PASSWORD, BLOCKED, USER_TYPE) VALUES (NULL, ?, ?, ?, ?, ?)',
        [teacher.id, teacher.email, password, false, 'TEACHER']
      );
    }
    
    // Create admin account (if it doesn't exist)
    const adminExists = await getData("SELECT * FROM USERS WHERE USER_TYPE = 'Management' AND USER_NAME = 'admin@admin.com'");
    if (adminExists.length === 0) {
      await runQuery(
        'INSERT INTO USERS (ID_STUDENT, ID_TEACHER, USER_NAME, PASSWORD, BLOCKED, USER_TYPE) VALUES (NULL, NULL, ?, ?, ?, ?)',
        ['admin@admin.com', 'admin', false, 'Management']
      );
    }

    // Create a password table file
    await createPasswordTable();

    console.log('Database population completed successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    db.close();
  }
}

// Function to create lessons for a course
async function createLessonsForCourse(courseId, startDate, endDate, dayOfWeek, startTime, endTime) {
  const start = moment(startDate);
  const end = moment(endDate);
  
  // Create a lesson for each week
  let current = start.clone();
  while (current.isSameOrBefore(end)) {
    // Set to the correct day of the week
    current.day(dayOfWeek);
    
    // Skip if the date is before the start date or after the end date
    if (current.isBefore(start) || current.isAfter(end)) {
      current.add(1, 'week');
      continue;
    }
    
    await runQuery(
      'INSERT INTO LESSON (ID_COURSE, LESSON_DATE, start_time, end_time) VALUES (?, ?, ?, ?)',
      [courseId, current.format('YYYY-MM-DD'), startTime, endTime]
    );
    
    current.add(1, 'week');
  }
}

// Function to clear the database
async function clearDatabase() {
  const tables = [
    'HOMEWORK_SUBMISSION',
    'ATTENDANCE',
    'LESSON',
    'INFORMATION_COURSE',
    'CLASS_MANAGEMENT',
    'REGISTRATION_FOR_COURSE',
    'HOMEWORK',
    'MATERIAL',
    'COURSE',
    'CLASS',
    'USERS',
    'STUDENT',
    'TEACHER'
  ];
  
  for (const table of tables) {
    await runQuery(`DELETE FROM ${table}`);
    await runQuery(`DELETE FROM sqlite_sequence WHERE name='${table}'`);
  }
}

// Function to create a password table file
async function createPasswordTable() {
  console.log('Creating password table...');
  
  // Get all users
  const users = await getData('SELECT * FROM USERS');
  
  // Create HTML content for the password table
  let htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>טבלת סיסמאות - מערכת ניהול בית ספר</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 20px;
      background-color: #f5f5f5;
    }
    h1 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 30px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 12px 15px;
      text-align: right;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #3498db;
      color: white;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    tr:hover {
      background-color: #e9f7fe;
    }
    .user-type {
      font-weight: bold;
      padding: 5px 10px;
      border-radius: 4px;
      display: inline-block;
    }
    .student {
      background-color: #2ecc71;
      color: white;
    }
    .teacher {
      background-color: #e74c3c;
      color: white;
    }
    .management {
      background-color: #f39c12;
      color: white;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>טבלת סיסמאות - מערכת ניהול בית ספר</h1>
    <table>
      <thead>
        <tr>
          <th>סוג משתמש</th>
          <th>שם משתמש</th>
          <th>סיסמה</th>
          <th>מזהה</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  // Add rows for each user
  for (const user of users) {
    const userType = user.USER_TYPE;
    const userTypeClass = userType.toLowerCase();
    const userId = user.ID_STUDENT || user.ID_TEACHER || 'N/A';
    
    htmlContent += `
        <tr>
          <td><span class="user-type ${userTypeClass}">${userType}</span></td>
          <td>${user.USER_NAME}</td>
          <td>${user.PASSWORD}</td>
          <td>${userId}</td>
        </tr>
    `;
  }
  
  htmlContent += `
      </tbody>
    </table>
  </div>
</body>
</html>
  `;
  
  // Write the HTML file
  fs.writeFileSync('password_table.html', htmlContent);
  console.log('Password table created: password_table.html');
}

// Run the population script
populateDatabase();