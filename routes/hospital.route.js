const router = require('express').Router()

// Validations
const { v_hospitalSignup, v_hospitalLogin, v_requestDonation, v_updateRequest } = require('../validations/hospital.validation')

// Middleware
const { verifyToken } = require('../middlewares/auth.middleware')
const { validationMiddleware } = require('../middlewares/validation.middleware')

// Controllers
const { signup, login, retrieveDonors, requestDonorDonation, completeRequest, requestHistory } = require('../controllers/hospital.controller')

// Routes
router.post('/auth/hospital/signup', validationMiddleware(v_hospitalSignup) , signup)
router.post('/auth/hospital/login', validationMiddleware(v_hospitalLogin) , login)
router.get('/hospital/donors/list', verifyToken, retrieveDonors)
router.post('/hospital/donation/request', verifyToken, validationMiddleware(v_requestDonation), requestDonorDonation)
router.patch('/hospital/donation/update', verifyToken, validationMiddleware(v_updateRequest), completeRequest)
router.get('/hospital/donation/history', verifyToken, requestHistory)

module.exports = router;