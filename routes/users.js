const express = require('express');
const router = express.Router();
const {
  userProfile,
  logoutUser
} = require('../controllers/users');

router
  .route('/profile')
  .get(userProfile)

router
  .route('/logout')
  .post(logoutUser)

module.exports = router;
