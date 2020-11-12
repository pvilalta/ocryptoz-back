import { Router } from 'express';
import { WalletController } from '../controllers/walletController'
const router = Router()
const controller = new WalletController()

router
    .route('/wallet')
    .get(controller.showWallets.bind(controller))
    .post(controller.submitWalletForm.bind(controller))

router
    .route('/wallet/:walletId')
    .get(controller.getOneWallet.bind(controller))
    .patch(controller.updateWallet.bind(controller))
    .delete(controller.deleteWallet.bind(controller))


export default router 
