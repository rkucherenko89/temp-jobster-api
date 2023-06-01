const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: 50,
    minlength: 3,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'lastName'
  },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'my city'
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
})

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  )
}

UserSchema.statics.authenticate = async function (email, candidatePassword) {
  const user = await this.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('No such user')
  }
  const isPasswordValid = await bcrypt.compare(candidatePassword, user.password)
  if (!isPasswordValid) {
    throw new UnauthenticatedError('Wrong password')
  }
  return user
}


module.exports = mongoose.model('User', UserSchema)
