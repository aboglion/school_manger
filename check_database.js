import sqlite3 from 'sqlite3';

// Connect to the database
const db = new sqlite3.Database('mydata.db');

// Function to get data from the database
function getData(query) {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        console.error('Error getting data:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Main function to check the database
async function checkDatabase() {
  try {
    console.log('Checking database...');

    // Check students
    const students = await getData('SELECT COUNT(*) as count FROM STUDENT');
    console.log(`Students: ${students[0].count}`);

    // Check teachers
    const teachers = await getData('SELECT COUNT(*) as count FROM TEACHER');
    console.log(`Teachers: ${teachers[0].count}`);

    // Check courses
    const courses = await getData('SELECT COUNT(*) as count FROM COURSE');
    console.log(`Courses: ${courses[0].count}`);

    // Check classes
    const classes = await getData('SELECT COUNT(*) as count FROM CLASS');
    console.log(`Classes: ${classes[0].count}`);

    // Check lessons
    const lessons = await getData('SELECT COUNT(*) as count FROM LESSON');
    console.log(`Lessons: ${lessons[0].count}`);

    // Check registrations
    const registrations = await getData('SELECT COUNT(*) as count FROM REGISTRATION_FOR_COURSE');
    console.log(`Course Registrations: ${registrations[0].count}`);

    // Check attendance
    const attendance = await getData('SELECT COUNT(*) as count FROM ATTENDANCE');
    console.log(`Attendance Records: ${attendance[0].count}`);

    // Check users
    const users = await getData('SELECT COUNT(*) as count FROM USERS');
    console.log(`User Accounts: ${users[0].count}`);

    // Check user types
    const userTypes = await getData('SELECT USER_TYPE, COUNT(*) as count FROM USERS GROUP BY USER_TYPE');
    console.log('User Types:');
    userTypes.forEach(type => {
      console.log(`  ${type.USER_TYPE}: ${type.count}`);
    });

    // Create password table
    await createPasswordTable();

    console.log('Database check completed!');
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    db.close();
  }
}

// Function to create a password table file
async function createPasswordTable() {
  console.log('Creating password table...');
  
  // Get all users
  const users = await getData('SELECT * FROM USERS');
  
  if (users.length === 0) {
    console.log('No users found in the database.');
    return;
  }
  
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
  const fs = await import('fs');
  fs.writeFileSync('password_table.html', htmlContent);
  console.log('Password table created: password_table.html');
}

// Run the check
checkDatabase();