//import express, express router as shown in lecture code
import express from 'express';


const router = express.Router();
router.route('/').get(async (req, res) => {
  const user = req.session.user;
  res.render('home', {
    user: user,
    cwid: '20003275',
    studentName: 'Savva Petrov'
  });
});


export default router;