const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (token) => {
  try {
    const data = await jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({ _id: data._id, 'tokens.token': token });
    if (!user) {
      return { error: 'Your session is expired please relogin' };
    }

    return user;
  } catch (error) {
    return response = { error: 'Not authorized to access this resource. please login!' }
  }
};

module.exports = auth;
