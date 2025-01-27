import dbFun from "../../model/dbFun.js";

function addStudent(){
    
    const query = `INSERT INTO STUDENT (NAME_STUDENT, ID_)
    VALUES ('omar','123456');`;
    dbFun.Updat(query)
} 
 
function addUser(){
    
    const query = `INSERT INTO USERS (ID_STUDENT, USER_NAME, PASSWORD, BLOCKED)
    VALUES (1, 'omar', '1234', 1);`;
    dbFun.Updat(query)
}

function login(){
    const query=`SELECT STUDENT.ID_STUDENT
    FROM USERS
    JOIN STUDENT ON USERS.ID_STUDENT = STUDENT.ID_STUDENT
    WHERE USERS.USER_NAME = 'omar'
      AND USERS.PASSWORD = '123';`;
   //  return dbFun.get_data(query);
    
}







export default {addStudent,addUser,login};