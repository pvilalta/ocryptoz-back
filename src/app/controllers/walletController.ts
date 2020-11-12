import { Request, Response } from 'express'
import { WalletInformations, WalletInformationsEdit } from '../interface/interface';
import { Wallet } from '../models/Wallet'


export class WalletController  {

    private wallet: Wallet = new Wallet();


    public async showWallets(req: Request, res: Response): Promise<Response>{

        try {

            const userId = 10
            
            const result = await this.wallet.showWalletByUserId(userId)

            if (!!result) return res.json(result)

            return res.json('You do not own any wallet yet')

        } catch (error) {
            return res.json('error: ' + error.message)
        }
    }

    public async getOneWallet(req: Request, res: Response): Promise<Response>{

        try {

            const userId = 10

            const walletId = parseInt(req.params.walletId, 10)                

            const result = await this.wallet.getOneWalletByUserId(walletId, userId)
    
            if (!!result) return res.json(result)
    
            return res.json('You do not own this wallet')
            
        } catch (error) {
            return res.json('error: ' + error.message)
        }

    }

    public async submitWalletForm(req: Request, res: Response): Promise<Response>{

        try {
            
            const userId = 12

            const wallets = await this.wallet.showWalletByUserId(userId)
    
            if (!wallets) {
                req.body.is_default = 1
            } else {
                for (let elem of wallets) {
                    if(req.body.name === elem.name) {
                        throw new Error('a wallet is already named this way')
                    }
                }
                req.body.is_default = '0'
            }
    
            req.body.user_id = userId

            const result = await this.wallet.insert(req.body)
    
            return res.json(result)

        } catch (error) {
            return res.json('error: ' + error.message)

        }
    }

    public async updateWallet(req: Request, res: Response): Promise<Response>{

        try {

            const userId = 12

            const walletId = parseInt(req.params.walletId, 10)   
    
            const wallet = await this.wallet.getOneWalletByUserId(walletId, userId)        
    
            if (!wallet) throw new Error('This wallet does not exist')
    
            const wallets = await this.wallet.showWalletByUserId(userId)
    
            // is_default: false to true
            if (!!wallets && wallets.length > 1 && wallet.is_default === false && req.body.is_default == 1) {
    
                for (let elem of wallets) {
                    if (elem.is_default === true) {
                        elem.is_default = '0'
                        
                        await this.wallet.update(elem)
                    }
                }
            }
    
            // is_default: true to false 
            if (wallet.is_default === true && req.body.is_default == 0) {
                if (!!wallets && wallets.length === 1) {
                    throw new Error(
                        `We can't proceed to your request, you only get one portfolio, it is your main by default`
                    )
                }
    
                if (!!wallets && wallets.length > 1) {
                    throw new Error(
                      `We can't proceed to your request, to change your main portfolio you have to choose an another one setting it up as your new main.`
                    );
                  }
            }
    
            // if name user does not give name to his portfolio
            if (!req.body.name) {
                req.body.name = wallet.name;
            }
    
            req.body.id = wallet.id
    
            const walletInfo: WalletInformationsEdit = req.body 
    
            const result: WalletInformations = await this.wallet.update(walletInfo)
    
            return res.json(result)
            
        } catch (error) {
            return res.json('error: ' + error.message)

        }


    }

    public async deleteWallet(req: Request, res: Response): Promise<Response>{

        try {

            const userId = 12

            const walletId = parseInt(req.params.walletId, 10)   
    
            const wallet = await this.wallet.getOneWalletByUserId(walletId, userId)   
            
            if (!wallet) throw new Error('This wallet does not exist')
    
            if (wallet.is_default === true) {
                throw new Error('You have to define your new main portfolio first');
    
            }
    
            const result = await this.wallet.delete(walletId)
            
            return res.json(result)

        } catch (error) {
            return res.json('error: ' + error.message)

        }



    }

}