import { Router } from 'express';
import { AccountController } from '../controllers/accountController'
import verifyToken from '../middleware/verifyToken'
const router = Router()
const controller = new AccountController()

import {userSchema} from '../validations/schema';
const { validateBody } = require('../validations/validate');


router
    .route('/account')
    .get(controller.showUsers.bind(controller))
    .post(validateBody(userSchema), verifyToken, controller.addUser.bind(controller))

router
    .route('/account/:id')
    .get(controller.showOneUser.bind(controller))
    .put(controller.updateUser.bind(controller))
    .delete(controller.deleteUser.bind(controller))

router.route('/login')
    .post(controller.loginUser.bind(controller))

router.route('/logout')
    .get(verifyToken, controller.logOut.bind(controller))
    


export default router 

