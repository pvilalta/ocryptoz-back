import {Request, Response, NextFunction} from 'express'

module.exports = {
    validateBody: function (schema: any) {
      return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
  
        if (error) {
          // res.status(400).json(error.details.map((details) => details.message));
          res.status(400).json(error.message); //// to make fonctionnate custom error
          return;
        }
        next();
      };
    },
  };
  