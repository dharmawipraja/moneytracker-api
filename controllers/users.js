const User = require('../models/User');

exports.userProfile = async (req, res, next) => {
  res.send(req.user)
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

