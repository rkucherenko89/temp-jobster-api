const express = require('express')
const router = express.Router()
const { register, login, updateUser } = require('../controllers/auth')
const authenticateUser = require('../middleware/authentication')
const testUserMiddleware = require('../middleware/testUser')
const rateLimiter = require('express-rate-limit')
const apiLimiter = rateLimiter({
  windowMS: 1000 * 60 * 15, // 15 minutes
  max: 10,
  message: {
    msg: 'To many requests from this IP, please try again after 15 min'
  }
})

// /api/v1/auth
router.post('/register', apiLimiter, register)
router.post('/login', apiLimiter, login)
router.patch('/updateUser', authenticateUser, testUserMiddleware, updateUser)


module.exports = router
