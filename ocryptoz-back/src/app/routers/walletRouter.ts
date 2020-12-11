import { Router } from 'express';
import { WalletController } from '../controllers/walletController'
import verifyToken from '../middleware/verifyToken'
const router = Router()
const controller = new WalletController()

router
    .route('/wallet')
    .get(controller.showWallets.bind(controller))
    .post(controller.submitWalletForm.bind(controller))

router
    .route('/wallet/:walletId')
    .get(verifyToken, controller.getOneWallet.bind(controller))
    .patch(verifyToken, controller.updateWallet.bind(controller))
    .delete(verifyToken, controller.deleteWallet.bind(controller))

router
    .route('/main/wallet')
    .get(controller.getMainWallet.bind(controller))


export default router 
