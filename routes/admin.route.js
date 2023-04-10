const router = require('express').Router()

// Validations
const { v_adminSignup, v_adminLogin, v_deactivateHospital } = require('../validations/admin.validation')

// Middleware
const { verifyToken } = require('../middlewares/admin-auth.middleware')
const { validationMiddleware } = require('../middlewares/validation.middleware')

// Controllers
const { signup, login, getAllDonors, getAllHospitals, getAllReports, deactivateHospitalAccount, activateHospital} = require('../controllers/admin.controller')

// Routes
router.post('/auth/admin/signup', validationMiddleware(v_adminSignup) , signup)
router.post('/auth/admin/login', validationMiddleware(v_adminLogin) , login)
router.get('/admin/donors/list', verifyToken, getAllDonors)
router.get('/admin/hospitals/list', verifyToken, getAllHospitals)
router.get('/admin/reports/list', verifyToken, getAllReports)
router.post('/admin/hospital/deactivate', validationMiddleware(v_deactivateHospital) ,verifyToken, deactivateHospitalAccount)
router.post('/admin/hospital/activate', validationMiddleware(v_activateHospital) ,verifyToken, activateHospital)

module.exports = router;