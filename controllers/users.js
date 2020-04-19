const User = require('../models/User');
const auth = require('../middlewares/auth')

exports.userProfile = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const user = await auth(token);
  if (user.error) {
    res.status(400).send({ error: user.error });
  } else {
    res.status(200).send({
      profile: {
        name: user.name,
        password: user.password
      }
    })
  }
};

exports.logoutUser = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const user = await auth(token);
    if (user.error) {
      res.status(400).send({});
    } else {
      user.tokens = [];
      const newUser = new User(user);
      await newUser.save();
      res.status(200).send({ logout: 'success' });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
}

exports.registerUser = async (req, res) =>{
  try {
    const user =  new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password, res);
    if (!user) {
      return res.status(401).send({ error: 'Login failed!'})
    }
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
};

