import { Router } from 'express';
import { AccountController } from '../controllers/accountController'
const router = Router()
const controller = new AccountController()

import {userSchema} from '../validations/schema';
const { validateBody } = require('../validations/validate');


router
    .route('/account')
    .get(controller.showUsers.bind(controller))
    .post(validateBody(userSchema), controller.addUser.bind(controller))

router
    .route('/account/:id')
    .get(controller.showOneUser.bind(controller))
    .put(controller.updateUser.bind(controller))
    .delete(controller.deleteUser.bind(controller))

router.route('/login')
    .post(controller.loginUser.bind(controller))
    


export default router 

