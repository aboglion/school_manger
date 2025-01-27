import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('mydata.db');
sqlite3.verbose();

// פונקציה ליצירת טבלאות אם הן לא קיימות
function createTablesIfNotExists() {
  const createStudentTable = `
    CREATE TABLE IF NOT EXISTS STUDENT (
      NAME_STUDENT TEXT,
      phone INTEGER,
      email TEXT,
      ID_ INTEGER PRIMARY KEY
    );
  `;

  const createTeacherTable = `
    CREATE TABLE IF NOT EXISTS TEACHER (
      ID_ INTEGER PRIMARY KEY,
      NAME_TEACHER TEXT,
      GMAIL TEXT,
      Phone INTEGER NOT NULL,
      ADDRESS TEXT
    );
  `;

  const createCourseTable = `
    CREATE TABLE IF NOT EXISTS COURSE (
      ID_COURSE INTEGER PRIMARY KEY AUTOINCREMENT,
      Name_Course TEXT NOT NULL,
      infromation TEXT NOT NULL,
      ID_TEACHER INTEGER,
      start_date DATE,
      start_time TIME,
      end_date DATE,
      end_time TIME,
      FOREIGN KEY (ID_TEACHER) REFERENCES TEACHER(ID_)
    );
  `;

  const createRegistrationForCourseTable = `
    CREATE TABLE IF NOT EXISTS REGISTRATION_FOR_COURSE (
      ID_REGISTRATION_FOR_COURSE INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_COURSE INTEGER,
      ID_STUDENT INTEGER,
      MARK INTEGER,
      PRESENCE INTEGER,
      FOREIGN KEY (ID_COURSE) REFERENCES COURSE(ID_COURSE),
      FOREIGN KEY (ID_STUDENT) REFERENCES STUDENT(ID_)
    );
  `;

  const createClassTable = `
    CREATE TABLE IF NOT EXISTS CLASS (
      ID_CLASS INTEGER PRIMARY KEY AUTOINCREMENT,
      SEAT_NUMBER INTEGER NOT NULL,
      CLASS_NAME TEXT,
      TAYP TEXT
    );
  `;

  const createClassManagementTable = `
    CREATE TABLE IF NOT EXISTS CLASS_MANAGEMENT (
      ID_CLASS_MANAGEMENT INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_COURSE INTEGER,
      ID_CLASS INTEGER,
      start_date DATE,
      start_time TIME,
      end_time TIME,
      FOREIGN KEY (ID_COURSE) REFERENCES COURSE(ID_COURSE),
      FOREIGN KEY (ID_CLASS) REFERENCES CLASS(ID_CLASS)
    );
  `;

  const createInformationCourseTable = `
    CREATE TABLE IF NOT EXISTS INFORMATION_COURSE (
      ID_INFORMATION_COURSE INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_COURSE INTEGER,
      INFORMATION_COURSE TEXT,
      SERVING_TIME DATE,
      FOREIGN KEY (ID_COURSE) REFERENCES COURSE(ID_COURSE)
    );
  `;

  const createLessonTable = `
    CREATE TABLE IF NOT EXISTS LESSON (
      ID_LESSON INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_COURSE INTEGER,
      HOMEWORKLBL TEXT,
      HOMEWORKBDF BLOB,
      LESSON_CONTENT TEXT,
      LESSON_DATE DATE,
      start_time TIME,
      end_time TIME,
      LESSON_DATA BLOB,
      FOREIGN KEY (ID_COURSE) REFERENCES COURSE(ID_COURSE)
    );
  `;

  const createAttendanceTable = `
    CREATE TABLE IF NOT EXISTS ATTENDANCE (
      ID_ATTENDANCE INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_STUDENT INTEGER,
      ID_LESSON INTEGER,
      DATE DATE,
      PRESENT BOOLEAN DEFAULT false,
      FOREIGN KEY (ID_STUDENT) REFERENCES STUDENT(ID_),
      FOREIGN KEY (ID_LESSON) REFERENCES LESSON(ID_LESSON),
      UNIQUE(ID_LESSON, ID_STUDENT)
    );
  `;

  const createHomeworkSubmissionTable = `
    CREATE TABLE IF NOT EXISTS HOMEWORK_SUBMISSION (
      ID_SUBMISSION INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_STUDENT INTEGER,
      ID_LESSON INTEGER,
      SUBMISSION_DATE DATE,
      FILE_NAME TEXT,
      FILE_DATA BLOB,
      MARKS_RECEIVED INTEGER,
      FOREIGN KEY (ID_STUDENT) REFERENCES STUDENT(ID_),
      FOREIGN KEY (ID_LESSON) REFERENCES LESSON(ID_LESSON)
    );
  `;

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS USERS (
      ID_USERS INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_STUDENT INTEGER,
      ID_TEACHER INTEGER,
      USER_NAME TEXT,
      PASSWORD TEXT,
      BLOCKED BOOLEAN DEFAULT true,
      USER_TYPE TEXT,
      FOREIGN KEY (ID_STUDENT) REFERENCES STUDENT(ID_),
      FOREIGN KEY (ID_TEACHER) REFERENCES TEACHER(ID_)
    );
  `;

  const createHomeworkTable = `
    CREATE TABLE IF NOT EXISTS HOMEWORK (
      ID_HOMEWORK INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_COURSE INTEGER,
      HOMEWORKLBL TEXT,
      DEADLINE DATE,
      GRADE INTEGER,
      FOREIGN KEY (ID_COURSE) REFERENCES COURSE(ID_COURSE)
    );
  `;

  const createMaterialTable = `
    CREATE TABLE IF NOT EXISTS MATERIAL (
      ID_MATERIAL INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_COURSE INTEGER,
      FILE_NAME TEXT,
      FOREIGN KEY (ID_COURSE) REFERENCES COURSE(ID_COURSE)
    );
  `;

  db.serialize(() => {
    db.run(createStudentTable);
    db.run(createTeacherTable);
    db.run(createCourseTable);
    db.run(createRegistrationForCourseTable);
    db.run(createClassTable);
    db.run(createClassManagementTable);
    db.run(createInformationCourseTable);
    db.run(createLessonTable);
    db.run(createAttendanceTable);
    db.run(createHomeworkSubmissionTable);
    db.run(createUsersTable);
    db.run(createHomeworkTable);
    db.run(createMaterialTable);
  });
}

// פונקציה ליצירת משתמש מנהל אם לא קיים
async function createAdminUserIfNotExists() {
  const checkAdminQuery = `SELECT * FROM USERS WHERE USER_TYPE = 'Management' AND USER_NAME = 'admin@admin.com'`;
  const existingAdmins = await get_data(checkAdminQuery);

  if (existingAdmins.length === 0) {
    const adminQuery = `
      INSERT INTO USERS (ID_STUDENT, ID_TEACHER, USER_NAME, PASSWORD, USER_TYPE, BLOCKED)
      VALUES (NULL, NULL, 'admin@admin.com', 'admin', 'Management', false)
    `;
    await updateData(adminQuery);
  }
}

function updateData(query) {
  return new Promise((resolve, reject) => {
    db.run(query, function (err) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log("Query executed successfully");
        resolve();
      }
    });
  });
}

async function get_data(qu) {
  return new Promise((resolve, reject) => {
    db.all(qu, (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

export default { updateData, get_data, createTablesIfNotExists, createAdminUserIfNotExists };

// הפעלת הפונקציה ליצירת טבלאות אם הן לא קיימות ויצירת משתמש מנהל אם לא קיים
createTablesIfNotExists();
createAdminUserIfNotExists();
