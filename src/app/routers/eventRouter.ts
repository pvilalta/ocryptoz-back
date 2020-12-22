import { Router } from 'express';
import { EventController } from '../controllers/eventController'
import {eventSchema} from '../validations/schema';
const { validateBody } = require('../validations/validate');
import verifyToken from '../middleware/verifyToken'
const router = Router()
const controller = new EventController()

router
    .route('/event/new/:walletId')
    .post(validateBody(eventSchema), verifyToken, controller.submitEventForm.bind(controller))
;

router
    .route('/event/:eventId')
    .patch(controller.editEventForm.bind(controller))
    .delete(controller.deleteEvent.bind(controller))
;



export default router 
