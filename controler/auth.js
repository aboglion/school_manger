import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.render('login', { error: 'אנא התחבר מחדש' });
  }

  jwt.verify(token, '#ookmcvk7t', (err, decoded) => {
    if (err) {
      return res.render('login', { error: 'שגיאה באימות, אנא התחבר מחדש' });
    }
    req.session.user = decoded;
    next();
  });
};

export const isTeacher = (req, res, next) => {
  if (req.session.user && req.session.user.user && req.session.user.user.USER_TYPE === 'TEACHER') {
    next();
  } else {
    res.status(403).send('גישה נדחתה');
  }
};

export const isManagement = (req, res, next) => {
  if (req.session.user && req.session.user.user && req.session.user.user.USER_TYPE === 'Management') {
    next();
  } else {
    res.status(403).send('גישה נדחתה');
  }
};

export default authenticate;
