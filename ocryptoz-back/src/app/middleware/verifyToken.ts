import {Request, Response, NextFunction} from 'express'
const jwt = require('jsonwebtoken');

export default function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authCookies = req.cookies['auth-token']

    if (authCookies == null) return res.sendStatus(401) // unvalid
    
    jwt.verify(authCookies, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    
        console.log('check user token', user)
        console.log('check err token', err)

        if (err)return res.sendStatus(403) // no longer valid

        res.locals = {
            ...res.locals,
            token: user
        };


        console.log('res.locals', res.locals)


        next()
    })
} 
