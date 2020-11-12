import { Router } from 'express';
import { AccountController } from '../controllers/accountController'
const router = Router()
const controller = new AccountController()

router
    .route('/account')
    .get(controller.showUsers.bind(controller))
    .post(controller.addUser.bind(controller))

router
    .route('/account/:id')
    .get(controller.showOneUser.bind(controller))
    .put(controller.updateUser.bind(controller))
    .delete(controller.deleteUser.bind(controller))
    


export default router 

