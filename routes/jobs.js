const express = require('express')
const router = express.Router()
const {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
  showStats
} = require('../controllers/jobs')
const testUserMiddleware = require('../middleware/testUser')


// /api/v1/jobs
router.get('/', getAllJobs)
router.get('/stats', showStats)
router.get('/:id', getJob)
router.post('/', testUserMiddleware, createJob)
router.patch('/:id', testUserMiddleware, updateJob)
router.delete('/:id', testUserMiddleware, deleteJob)


module.exports = router
