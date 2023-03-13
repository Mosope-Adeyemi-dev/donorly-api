const router = require('express').Router()

// Validations
const { v_donorSignup, v_donorLogin, v_updateRequest, v_reportSpam } = require('../validations/donor.validation')

// Middleware
const { verifyToken } = require('../middlewares/auth.middleware')
const { validationMiddleware } = require('../middlewares/validation.middleware')

// Controllers
const { signup, login, profileSetup, requestHistory, updateRequestStatus, reportSpam } = require('../controllers/donor.controller')

// Routes
router.post('/auth/donor/signup', validationMiddleware(v_donorSignup) , signup)
router.post('/auth/donor/login', validationMiddleware(v_donorLogin) , login)
router.put('/donor/profile/setup', verifyToken, profileSetup)
router.get('/donor/donation/list', verifyToken, requestHistory)
router.patch('/donor/donation/update', verifyToken, validationMiddleware(v_updateRequest), updateRequestStatus)
router.post('/donor/donation/report', verifyToken, validationMiddleware(v_reportSpam), reportSpam)

module.exports = router;