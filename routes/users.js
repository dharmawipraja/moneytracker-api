const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  userProfile,
  logoutUser
} = require('../controllers/users');

router
  .route('/register')
  .post(registerUser);

router
  .route('/login')
  .post(loginUser);

router
  .route('/profile')
  .get(userProfile)

router
  .route('/logout')
  .post(logoutUser)

module.exports = router;
