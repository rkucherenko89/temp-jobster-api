const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')


const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res
    .status(StatusCodes.CREATED)
    .json({
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        token
      }
    })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.authenticate(email, password)
  const token = user.createJWT()
  res
    .status(StatusCodes.OK)
    .json({
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        token
      }
    })
}

const updateUser = async (req, res) => {
  const requiredFields = ['name', 'lastName', 'location', 'email']
  for (const field of requiredFields) {
    if (!req.body[field]) {
      throw new BadRequestError(`${field}__required`)
    }
  }
  const user = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true, runValidators: true })
  const token = user.createJWT()
  res
    .status(StatusCodes.OK)
    .json({
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        token
      }
    })
}


module.exports = {
  register,
  login,
  updateUser
}
