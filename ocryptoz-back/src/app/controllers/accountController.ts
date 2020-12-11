import { Request, Response } from 'express'
import { User } from '../models/User'
import { Wallet } from '../models/Wallet'
import * as bcrypt from 'bcrypt'
import { AccountInt } from '../interface/interface'
const jwt = require('jsonwebtoken');



export class AccountController {

    private user: User = new User();
    private wallet: Wallet = new Wallet();



    public async loginUser (req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body


            let emailObject: Object = {
                'email': email
            }


            const existingUser = await this.user.findOneByValue(emailObject)

            
            if (!existingUser) {
                throw new Error('This email doest not match any user');
            }

            const isPasswordValid = bcrypt.compareSync(
                password,
                existingUser.password
            );

            if (!isPasswordValid) {
                throw new Error('Password incorrect');
            }



            /*
            const accessToken = jwt.sign({id: existingUser.id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

            res.cookie('auth-token', accessToken, { 
                maxAge: 3600 * 2, 
                httpOnly: true, 
                // secure: true 
            });
            res.header('auth-token', accessToken);

            //return res.json({accessToken})
            */
            

            return res.json(true)


        } catch (error) {
            return res.status(400).json(error.message);

        }



    }


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
            
            // type guard treatment
            if (this.isAccount(req.body)) {
                let userInfo: AccountInt = req.body
                const result = await this.user.insert(userInfo)
                return res.json(result)
            } else {
                throw new Error('Invalid Account format')
            }

        } catch (error) {
            return res.status(400).json(error.message);

        }

    }

    public async updateUser(req: Request, res: Response): Promise<Response>  { 

        try {

            const id = parseInt(req.params.id, 10)

            const isUserExist = await this.user.findOne(id)        
    
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
                
                // push modification into the user object
                for (let elem in req.body) {
                    if(isUserExist[elem]) {
                        isUserExist[elem] = req.body[elem]
                    }
                }
                
                // type guard treatment
                if (this.isAccount(isUserExist)) {
                    const result = await this.user.update(isUserExist)
                    return res.json(result)
                } else {
                    throw new Error('Invalid Account format')
                }
                
    
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

    private isAccount(elem: any): elem is AccountInt {
        return typeof elem.firstname === 'string' 
            && typeof elem.lastname === 'string' 
            && typeof elem.email === 'string' 
            && typeof elem.password === 'string' 
            && typeof elem.country === 'string'
    }

}


