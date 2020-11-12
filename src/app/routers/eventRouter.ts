import { Router } from 'express';
import { EventController } from '../controllers/eventController'
const router = Router()
const controller = new EventController()

router
    .route('/event/new/:walletId')
    .post(controller.submitEventForm.bind(controller))



export default router 
