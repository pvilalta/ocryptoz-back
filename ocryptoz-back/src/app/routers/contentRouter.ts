import { Router } from 'express';
import { ContentController } from '../controllers/contentController'
const router = Router()
const controller = new ContentController()

router
    .route('/content/platform')
    .get(controller.showPlatform.bind(controller))
;

router
    .route('/content/asset')
    .get(controller.showAsset.bind(controller))
;

export default router 
