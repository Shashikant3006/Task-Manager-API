import express from 'express';
import { registerController, loginController, updateProfileController,changePasswordController} from '../controller/authController.js';
import { requireSignIn } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.put('/update-profile',requireSignIn, updateProfileController);
router.put('/change-password', requireSignIn, changePasswordController);

export default router;

