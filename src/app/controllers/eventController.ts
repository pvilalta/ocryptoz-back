import { Request, Response } from 'express'
import { EventInt, WalletInt } from '../interface/interface';
import { Event } from '../models/Event'
import { Wallet } from '../models/Wallet';
import { bodyControl } from '../logical/eventHandler';



export class EventController  {

    private event: Event = new Event();
    private wallet: Wallet = new Wallet();



    public async submitEventForm(req: Request, res: Response): Promise<Response>  {

        try {

            const userId = 16
            const walletId = parseInt(req.params.walletId, 10)            
    
            const wallet = await this.wallet.getOneWalletByUserId(walletId, userId)   
            if (!wallet) throw new Error('This wallet does not exist')
    
            // defining properties
            req.body.wallet_id = walletId
            req.body.date = new Date(req.body.date)

            // body treatment
            req.body = await bodyControl(req.body)
                        
            // type guard treatment
            if (this.isEvent(req.body)) {
                const result = await this.event.insert(req.body)
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

            // get user info
            const userId = 16
            const eventId = parseInt(req.params.eventId, 10)
            
            let { currentEvent } = await this.isEventOwnedByUser(userId, eventId)

            // push modification into the event
            for (let elem in req.body) {
                if(currentEvent[elem]) {
                    currentEvent[elem] = req.body[elem]
                }
            }

            // select either unit_price or total_amount
            let priceType = this.typePrice(req.body)

            // body treatment (to re-perform maths)
            currentEvent = await bodyControl(currentEvent, priceType)
            
            
            // type guard treatment
            if (this.isEvent(currentEvent)) {
                const result = await this.event.update(currentEvent)
                return res.json(result)

            } else {
                throw new Error('Invalid Event format')
            }

            
        } catch (error) {
            return res.json('error: ' + error.message)

        }
    }

    public async deleteEvent(req: Request, res: Response): Promise<Response>  {

        try {
            // get user info
            const userId = 16
            const eventId = parseInt(req.params.eventId, 10)

            // is Event owned by this user ?
            let { currentEvent } = await this.isEventOwnedByUser(userId, eventId)

            // if yes, proceed to the delete of the event
            const result = await this.event.delete(currentEvent.id)

            // end point
            return res.json(result)
        } catch (error) {
            return res.json('error: ' + error.message)

        }

    }



    private isEvent(elem: any): elem is EventInt {

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

    private async isEventOwnedByUser(userId: number, eventId: number): Promise<any> {
        // get event + handling error
        const currentEvent: EventInt = await this.event.findOne(eventId)            
        if (!currentEvent) throw new Error(`This event does not exist`);

        //  get user's wallet + handling error
        const wallet: WalletInt = await this.wallet.getOneWalletByUserId(currentEvent.wallet_id, userId)   
        if (!wallet) throw new Error('This event does not exist')

        return {
            currentEvent,
            wallet
        }
    }

    private typePrice(body: any): any {

        if (body.unit_price && !body.total_amount) {
            return 'unitPrice'

         } else if (!body.unit_price && body.total_amount) {
             return 'totalAmount'

         } else if (body.unit_price && body.total_amount){
             throw new Error(
                 'You have to choose either total amount or unit price to declare your event but not both at the same time'
             );
         }

    }

}