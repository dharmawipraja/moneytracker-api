const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email:  {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: 'Invalid email address' })
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.pre('save', async function(next) {
  // Encrypt user password
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, parseInt(process.env.BCRYPT_SALT));
  }
  next();
});

UserSchema.methods.generateAuthToken = async function() {
  // Generate JWT
  const user =  this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token })
  await user.save();
  return token;
};

UserSchema.statics.findByCredentials = async (email, password) => {
  // Search user
  const user = await User.findOne({ email });
  if (!user) {
    return { error: 'Invalid login credentials' }
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return { error: 'Invalid login credentials' }
  }
  return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
