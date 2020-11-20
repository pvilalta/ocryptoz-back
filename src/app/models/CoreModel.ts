import db from "../config/db"
import { editUserInt, editWalletInt, newUserInt, newWalletInt} from "../interface/interface";


export abstract class CoreModel {
    
    // constructor(public id: number){}
    
    public async findAll(): Promise<any[]> {
                
        try {            
            
            const result = await db.query(
                `SELECT * FROM "${this.constructor.name.toLowerCase()}"`
            );

            return result.rows;

        } catch (error) {
            throw new Error('error: ' + error.message)
        }
    }

    public async findOne(id: number): Promise<any> {
        try {

            const result = await db.query(
                `SELECT * FROM "${this.constructor.name.toLowerCase()}" WHERE id = $1`,
                [id]
            );
            
            return result.rows[0]

        } catch (error) {
            throw new Error(error.message)

        }
    }

    public async findOneByValue(value: Object): Promise<any[]> {
        try {

            const result = await db.query(
                `SELECT * FROM "${this.constructor.name.toLowerCase()}" WHERE ${Object.keys(
                  value
                ).toString()} = $1`,
                Object.values(value)
            );

            return result.rows[0]
        } catch (error) {
            throw new Error(error.message)

        }
    }

    public async insert(value: newUserInt | newWalletInt): Promise<any[]> {

        try {
            let filterFields = []
            for (let elem of Object.keys(value)) {
                filterFields.push(elem)
            }

            let i = 0;
            const preparedQuery = {
              text: `
                    INSERT INTO "${this.constructor.name.toLowerCase()}" (${filterFields.join()}) 
                    VALUES (${filterFields.map(() => '$' + ++i)})
                    RETURNING *
                `,
              values: Object.values(value),
            };
            
            const result = await db.query(preparedQuery);
            
            return result.rows[0]
        } catch (error) {
            throw new Error(error.message)

        }
    }

    public async update(value: editWalletInt | editUserInt): Promise<any> {

        try {

            // saving id before elem treatment
            const keepId = value.id
            delete value.id

            let filterFields = []
            for (let elem of Object.keys(value)) {
                filterFields.push(elem)
            }

            let i = 0;
            let updateList = [];
            for (const field of filterFields) {
              updateList.push(`"${field}" = $${++i}`);
            }

            const preparedQuery = {
              text: `UPDATE "${this.constructor.name.toLowerCase()}" SET
                    ${updateList.join()}
                  WHERE id = $${++i}
                  RETURNING *
              `,
              values: [...filterFields.map((field) => value[field]), keepId],
            };            

            const result = await db.query(preparedQuery);            

            return result.rows[0]

        } catch (error) {
            throw new Error(error.message)

        }


    }

    public async delete(id: number): Promise<boolean> {

        try {
            const preparedQuery = {
                text: `DELETE FROM "${this.constructor.name.toLowerCase()}" WHERE id = $1
                `,
                values: [id],
            };
        
            const result = await db.query(preparedQuery);

            return result.rowCount === 1 ? true : false;


        } catch (error) {
            throw new Error(error.message)
        }

    }


}