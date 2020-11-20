import db from '../config/db'
import { CoreModel } from './CoreModel'

export class Wallet extends CoreModel {

    /* constructor (id: number, public name: string, public is_default: boolean, public user_id: number){super(id)}*/


    public async showWalletByUserId(id: number): Promise<any[] | undefined> {

        try {
            const result = await db.query(
                `
                SELECT *
                FROM "wallet"
                WHERE user_id = (SELECT id FROM "user" WHERE id = $1) ORDER BY id
                `,
                [id]
              );
              
              if (result.rows.length === 0) return undefined 
        
              return result.rows 
        } catch (error) {
            throw new Error(error.message)

        }
    }

    public async getOneWalletByUserId(walletId: number, userId: number): Promise<any> {

        try {
            const result = await db.query(
                `
                SELECT *
                FROM "wallet"
                WHERE user_id = (SELECT id FROM "user" WHERE id = $1)
                AND id = $2
                `,
                [userId, walletId]
              );              
              
            if (result.rows.length === 0) return undefined 
        
            return result.rows[0]   

        } catch (error) {
            throw new Error(error.message)

        }
    }

};
