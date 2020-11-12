import { Request, Response } from 'express'
import { User } from '../models/User'
import * as bcrypt from 'bcrypt'
import { UserInformations, UserInformationsEdit } from '../interface/interface'


export class AccountController {

    private user: User = new User();


    public async showUsers(req: Request, res: Response): Promise<Response>  {
        
        try {
            const result = await this.user.findAll()

            return res.json(result)
        } catch (error) {
            return res.json('error: ' + error.message)

        }

    }

    public async showOneUser(req: Request, res: Response): Promise<Response>  {

        
        try {            

            const result = await this.user.findOne(parseInt(req.params.id))

            return res.json(result)
        } catch (error) {
            return res.json('error: ' + error.message)

        }

    }

    public async addUser(req: Request, res: Response): Promise<Response>  {
        
        try {            

            let emailObject: Object = {
                'email': req.body.email
            }

            const isEmailValid = await this.user.findOneByValue(emailObject)

            if(!!isEmailValid) {
                throw new Error('An user with this email already exist')
            }

            if(!!req.body.password && !!req.body.passwordConfirmation) {
                if(req.body.password !== req.body.passwordConfirmation) {
                    throw new Error('Passwords doest not match')
                }
            } else {
                throw new Error('Password is required')
            }

            delete req.body.passwordConfirmation

            req.body.password = await bcrypt.hash(req.body.password, 10)

            const userInfo: UserInformations = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                country: req.body.country
            }


            const result = await this.user.insert(userInfo)


            return res.json(result)
        } catch (error) {
            return res.json('error: ' + error.message)

        }

    }

    public async updateUser(req: Request, res: Response): Promise<Response>  { 

        try {

            const id = parseInt(req.params.id, 10)

            const isUserExist: UserInformations = await this.user.findOne(id)        
    
            if(!!isUserExist) {
    
                if((!!req.body.newPassword && !!req.body.oldPassword)) {
                    
                    const isPasswordValid = bcrypt.compareSync(
                        req.body.oldPassword,
                        isUserExist.password
                    );
    
                    if (!isPasswordValid) {
                        throw new Error('passwords doesnt match');
                    } 
    
                    // Crypt the password and add it in DB
                    req.body.password = await bcrypt.hash(req.body.newPassword, 10);
                    delete req.body.oldPassword;
                    delete req.body.newPassword;

                    
                } else if (!!req.body.newPassword && !req.body.oldPassword){
                    throw new Error('Initial password is missing')

                } else if (!req.body.newPassword && !!req.body.oldPassword){
                    throw new Error('New password is missing')

                }
                
                req.body.id = id;
                let userInfo: UserInformationsEdit = req.body;
                
                const result: UserInformations = await this.user.update(userInfo)
    
                return res.json(result)
            } else {
                throw new Error('This user is not existing')
    
            }
            
        } catch (error) {
            return res.json('error: ' + error.message)

        }

    }

    public async deleteUser(req: Request, res: Response): Promise<Response>  {

        try {
            const result = await this.user.delete(parseInt(req.params.id))

            return res.json(result)
            
        } catch (error) {
            return res.json('error: ' + error.message)

        }


    }

}


