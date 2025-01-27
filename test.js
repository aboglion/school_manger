import  sqlite3  from 'sqlite3';
 const db = new sqlite3.Database('mydata.db');
 //sqlite3.verbose();

function Updat(query) {
        db.run(query, (err) => {
      if (err) console.error(err.message);
      console.log("yas");
    });
  }
 
  
  function get_data1() {
    const qu='SELECT ID_STUDENT FROM STUDENT WHERE NAME_STUDENT="omarA" AND ID_=1234567 ;'
    //const db = new sqlite3.Database('mydata.db');
  
    db.all(qu, (err, rows) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(rows);
      }
  
      // Close the database
     
    });
  }
  
//   Updat(`INSERT INTO STUDENT (NAME_STUDENT, ID_)
//   VALUES ('omar','1234567');`);
get_data1()
db.close();

//get_data1();  

// STUDENT table
// function updateStudentName(studentId, newName) {
//   const query = `UPDATE STUDENT SET NAME_STUDENT = ? WHERE ID_STUDENT = ?;`;
//   db.run(query, [newName, studentId], (err) => {
//     if (err) console.error(err.message);
//     console.log(`تم تحديث البيانات بنجاح للطالب رقم ${studentId}`);
//   });
// }  

// function addNewStudent(studentName, studentId) {
//   const query = `INSERT INTO STUDENT (NAME_STUDENT, ID_) VALUES (?, ?);`;
//   db.run(query, [studentName, studentId], (err) => {
//     if (err) console.error(err.message);
//     console.log(`تمت إضافة الطالب ${studentName} بنجاح`);
//   });
// }

// // TEACHER table
// function updateTeacherSalary(teacherId, newSalary) {
//   const query = `UPDATE TEACHER SET SALARY = ? WHERE ID_TEACHER = ?;`;
//   db.run(query, [newSalary, teacherId], (err) => {
//     if (err) console.error(err.message);
//     console.log(`تم تحديث راتب المعلم رقم ${teacherId} بنجاح`);
//   });
// }

// function addNewTeacher(teacherName, salary, address) {
//   const query = `INSERT INTO TEACHER (NAME_TEACHER, SALARY, ADDRESS) VALUES (?, ?, ?);`;
//   db.run(query, [teacherName, salary, address], (err) => {
//     if (err) console.error(err.message);
//     console.log(`تمت إضافة المعلم ${teacherName} بنجاح`);
//   });
// }

// // COURSE table
// // ...

// // REGISTRATION_FOR_COURSE table
// // ...

// // CLASS table
// // الدوال الخاصة بالجدول CLASS
// function updateClassSeatNumber(classId, newSeatNumber) {
//     const query = `
//       UPDATE CLASS
//       SET SEAT_NUMBER = ?
//       WHERE ID_CLASS = ?;
//     `;
  
//     db.run(query, [newSeatNumber, classId], (err) => {
//       if (err) {
//         return console.error(err.message);
//       }
//       console.log(`تم تحديث عدد المقاعد للصف رقم ${classId} بنجاح`);
//     });
//   }
  
//   function addNewClass(seatNumber, className, type) {
//     const query = `
//       INSERT INTO CLASS (SEAT_NUMBER, CLASS_NAME, TAYP)
//       VALUES (?, ?, ?);
//     `;
  
//     db.run(query, [seatNumber, className, type], (err) => {
//       if (err) {
//         return console.error(err.message);
//       }
//       console.log(`تمت إضافة صف جديد بنجاح`);
//     });
//   }
  
//   function deleteClass(classId) {
//     const query = `
//       DELETE FROM CLASS
//       WHERE ID_CLASS = ?;
//     `;
  
//     db.run(query, [classId], (err) => {
//       if (err) {
//         return console.error(err.message);
//       }
//       console.log(`تم حذف الصف رقم ${classId} بنجاح`);
//     });
//   }
  
//   // الدوال الخاصة بالجدول CLASS_MANAGEMENT
//   function updateClassManagementTime(classManagementId, newClassTime) {
//     const query = `
//       UPDATE CLASS_MANAGEMENT
//       SET CLASS_TIME = ?
//       WHERE ID_CLASS_MANAGEMENT = ?;
//     `;
  
//     db.run(query, [newClassTime, classManagementId], (err) => {
//       if (err) {
//         return console.error(err.message);
//       }
//       console.log(`تم تحديث وقت إدارة الصف رقم ${classManagementId} بنجاح`);
//     });
//   }
  
//   function addNewClassManagement(courseId, classId, classTime) {
//     const query = `
//       INSERT INTO CLASS_MANAGEMENT (ID_COURSE, ID_CLASS, CLASS_TIME)
//       VALUES (?, ?, ?);
//     `;
  
//     db.run(query, [courseId, classId, classTime], (err) => {
//       if (err) {
//         return console.error(err.message);
//       }
//       console.log(`تمت إضافة إدارة صف جديدة بنجاح`);
//     });
//   }
  
//   function deleteClassManagement(classManagementId) {
//     const query = `
//       DELETE FROM CLASS_MANAGEMENT
//       WHERE ID_CLASS_MANAGEMENT = ?;
//     `;
  
//     db.run(query, [classManagementId], (err) => {
//       if (err) {
//         return console.error(err.message);
//       }
//       console.log(`تم حذف إدارة الصف رقم ${classManagementId} بنجاح`);
//     });
//   }
  
//   // الدوال الخاصة بالجدول HOMEWORK
//   function updateHomeworkTime(homeworkId, newHomeworkTime) {
//     const query = `
//       UPDATE HOMEWORK
//       SET TIME_HOMEWORK = ?
//       WHERE ID_HOMEWORK = ?;
//     `;
  
//     db.run(query, [newHomeworkTime, homeworkId], (err) => {
//       if (err) {
//         return console.error(err.message);
//       }
//       console.log(`تم تحديث وقت الواجب رقم ${homeworkId} بنجاح`);
//     });
//   }
  
//   function addNewHomework(courseId, homeworkTime, homeworkText) {
//     const query = `
//       INSERT INTO HOMEWORK (ID_COURSE, TIME_HOMEWORK, THE_HOMEWORK)
//       VALUES (?, ?, ?);
//     `;
  
//     db.run(query, [courseId, homeworkTime, homeworkText], (err) => {
//       if (err) {
//         return console.error(err.message);
//       }
//       console.log(`تمت إضافة واجب جديد بنجاح`);
//     });
//   }
  
//   function deleteHomework(homeworkId) {
//     const query = `
//       DELETE FROM HOMEWORK
//       WHERE ID_HOMEWORK = ?;
//     `;
  
//     db.run(query, [homeworkId], (err) => {
//       if (err) {
//         return console.error(err.message);
//       }
//       console.log(`تم حذف الواجب رقم ${homeworkId} بنجاح`);
//     });
//   }
  
//   // الدوال الخاصة بالجدول SOLVE_HOMEWORK
//   // ...
  
//   // الدوال الخاصة بالجدول INFORMATION_COURSE
//   // ...
  
//   // الدوال الخاصة بالجدول USERS
//   // ...
  
//   // إغلاق قاعدة البيانات عند الانتهاء
//   db.close();
  

// // CLASS_MANAGEMENT table
// // ...


// // SOLVE_HOMEWORK table
// // ...

// // INFORMATION_COURSE table
// // ...

// // USERS table
// // ...

// // إغلاق قاعدة البيانات عند الانتهاء
db.close();

export default{Updat};