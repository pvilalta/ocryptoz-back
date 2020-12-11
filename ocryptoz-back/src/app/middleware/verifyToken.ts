import {Request, Response, NextFunction} from 'express'
var jwt = require('jsonwebtoken');

export default function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authCookies = req.cookies['auth-token']
    console.log('authCookies', authCookies)

    const token = authCookies && authCookies.split(' ')[1]

    if (token == null) return res.sendStatus(401) // unvalid
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
        
        if (err)return res.sendStatus(403) // no longer valid

        res.locals = {
            ...res.locals,
            token: user
        };
        next()
    })
} 