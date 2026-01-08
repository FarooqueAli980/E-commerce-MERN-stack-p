import express from 'express'
import { 
    allUser,
    changePassword,
    forgotPassword,
    getUserById,
    login,
    logout,
    register,
    reVerify,
    verify,
    verifyOTP
} from '../controllers/userController.js'

import { isAdmin, isAuthincated } from '../middleware/isAuthinticated.js'

const router = express.Router()

router.post('/register', register)
router.post('/verify', verify)
router.post('/reVerify', reVerify)
router.post('/login', login)
router.post('/logout', isAuthincated, logout)
router.post('/forgotPassword', forgotPassword)
router.post('/verifyOTP/:email', verifyOTP)
router.post('/changePassword/:email', changePassword)
router.get('/all-user',isAuthincated,isAdmin,allUser)
router.get('/get-user/:userId',getUserById)


export default router
