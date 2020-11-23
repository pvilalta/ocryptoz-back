import { Request, Response } from 'express'
import { newEventInt, newWalletInt } from '../interface/interface';
import { Event } from '../models/Event'
import { Wallet } from '../models/Wallet';
import { bodyControl } from '../logical/eventHandler';



export class EventController  {

    private event: Event = new Event();
    private wallet: Wallet = new Wallet();



    public async submitEventForm(req: Request, res: Response): Promise<Response>  {

        try {

            const userId = 12

            const walletId = parseInt(req.params.walletId, 10)            
    
            const wallet = await this.wallet.getOneWalletByUserId(walletId, userId)   

            if (!wallet) throw new Error('This wallet does not exist')
    
            // defining properties
            req.body.wallet_id = walletId
            req.body.date = new Date(req.body.date)

            // body treatment
            req.body = await bodyControl(req.body)
                        
            // type guard treatment
            if (this.isEventNew(req.body)) {
                let eventInfo: newEventInt = req.body
                const result = await this.event.insert(eventInfo)
                return res.json(result)

            } else {
                throw new Error('Invalid Event format')
            }
            
        } catch (error) {
            return res.json('error: ' + error.message)

        }


    }

    public async editEventForm(req: Request, res: Response): Promise<Response>  {

        try {

            const userId = 12

            const eventId = parseInt(req.params.eventId, 10)
            
            let currentEvent: newEventInt = await this.event.findOne(eventId)            

            if (!currentEvent) throw new Error(`This event does not exist`);
    
            const wallet: newWalletInt = await this.wallet.getOneWalletByUserId(currentEvent.wallet_id, userId)   

            if (!wallet) throw new Error('This event does not exist')
            
            // let dataToModify: any = {
            //     id: eventId
            // }

            // for (let elem in req.body) {
            //     dataToModify[elem] = req.body[elem]

            // }

            for (let elem in req.body) {
                
                if(currentEvent[elem]) {
                    currentEvent[elem] = req.body[elem]
                }
            }

            console.log(currentEvent);


            // body treatment
            currentEvent = await bodyControl(currentEvent)

            

            // type guard treatment
            if (this.isEventNew(currentEvent)) {
                let eventInfo: newEventInt = currentEvent
                const result = await this.event.update(eventInfo)
                return res.json(result)

            } else {
                throw new Error('Invalid Event format')
            }

            
        } catch (error) {
            return res.json('error: ' + error.message)

        }


    }



    private isEventNew(elem: any): elem is newEventInt {

        return typeof elem.type === 'string' 
            && elem.date instanceof Date 
            && typeof elem.quantity === 'number' 
            && typeof elem.total_amount === 'number' 
            && typeof elem.unit_price === 'number' 
            && typeof elem.fees === 'number' 
            && typeof elem.note === 'string' 
            && typeof elem.platform_sending === 'string' 
            && typeof elem.platform_receiving === 'string' 
            && typeof elem.currency_asset === 'string' 
            && typeof elem.currency_counterparty === 'string' 
            && typeof elem.currency_fees === 'string' 
            && typeof elem.wallet_id === 'number' 
            && typeof elem.ref_usd_amount === 'number' 
            && typeof elem.ref_usd_fees === 'number'
            && elem.created_at instanceof Date
    }

}