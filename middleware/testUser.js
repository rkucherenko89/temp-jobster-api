const { BadRequestError } = require("../errors")


const testUserMiddleware = (req, res, next) => {
  if (req.user.isTestUser) {
    throw new BadRequestError('Test user. Only read')
  }
  next()
}


module.exports = testUserMiddleware