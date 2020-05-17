const User = require('../models/User');

exports.userProfile = async (req, res, next) => {
  const { _id, name, email } = req.user;
  const profile = {
    _id,
    name,
    email
  };
  
  res.status(200).send(profile);
};

exports.logoutUser = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token != req.token
    })
    await req.user.save()
    res.status(200).send({ logout: 'success' })
  } catch (error) {
    res.status(500).send(error)
  }
};

