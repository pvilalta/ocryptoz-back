import { Router } from 'express';
import { WalletController } from '../controllers/walletController'
import verifyToken from '../middleware/verifyToken'
const router = Router()
const controller = new WalletController()

router
    .route('/wallet')
    .get(verifyToken, controller.showWallets.bind(controller))
    .post(controller.submitWalletForm.bind(controller))

router
    .route('/wallet/:walletId')
    .get(verifyToken, controller.getOneWallet.bind(controller))
    .patch( controller.updateWallet.bind(controller))
    .delete( controller.deleteWallet.bind(controller))

router
    .route('/main/wallet')
    .get(verifyToken, controller.getMainWallet.bind(controller))



router
    .route('/wallet/assetpie/:walletId')
    .get(controller.showAssetPie.bind(controller))
;


export default router 
