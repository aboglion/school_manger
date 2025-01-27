import express from "express";
import teacher from './controler/Teacher.js';
import session from 'express-session';
import Management from './controler/Management.js';
import { isManagement, isTeacher } from "./controler/auth.js";
import raot from './controler/raot.js'; 
import studentRouter from './controler/student.js';
import cookieParser from 'cookie-parser';
import dbFun from './model/dbFun.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser()); // חדש: שימוש ב-cookie-parser

app.set('view engine', 'ejs');
app.set('views', 'views');

// Session configuration
app.use(session({
    secret: 'DgG&$h09784I%jJSGTf',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // עדכון זמן ה-session ל-1 שעה
}));

const port = '3900';

dbFun.createTablesIfNotExists();
dbFun.createAdminUserIfNotExists();

app.use('/', raot);
app.use('/student', studentRouter);
app.use('/Teacher', isTeacher, teacher);
app.use('/Management', isManagement, Management);

app.listen(port, () => {
    console.log(`the Server is raning on port ${port}`);
});
