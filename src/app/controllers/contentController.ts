import { Request, Response } from 'express'
import { Platform_exchange } from '../models/PlatformExchange'
import { Currency } from '../models/Currency'



export class ContentController  {

    private platformExchange: Platform_exchange = new Platform_exchange();
    private currency: Currency = new Currency();


    public async showPlatform (req: Request, res: Response): Promise<Response> {

        try {

        const platform = await this.platformExchange.findAll()

        return res.json(platform)

        } catch (error) {
            return res.status(400).json(error.message);

        }


    }

    public async showAsset (req: Request, res: Response): Promise<Response> {

        try {

        const asset = await this.currency.findAll()

        return res.json(asset)

        } catch (error) {
            return res.status(400).json(error.message);

        }


    }


}