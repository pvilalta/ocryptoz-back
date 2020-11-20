import { Request, Response } from 'express'
import { SubmitEventInformations } from '../interface/interface';
import { Event } from '../models/Event'
import { Wallet } from '../models/Wallet';


export class EventController  {

    private event: Event = new Event();
    private wallet: Wallet = new Wallet();



    public async submitEventForm(req: Request, res: Response): Promise<Response>  {

        try {

            const userId = 12

            const walletId = parseInt(req.params.walletId, 10)            
    
            const wallet = await this.wallet.getOneWalletByUserId(walletId, userId)   

            if (!wallet) throw new Error('This wallet does not exist')
    
            req.body.wallet_id = walletId

            const eventInfo: SubmitEventInformations = req.body

            console.log(eventInfo);
            
    
            const result = await this.event.insert(eventInfo);
    
            return res.json(result)
            
        } catch (error) {
            return res.json('error: ' + error.message)

        }


    }

}