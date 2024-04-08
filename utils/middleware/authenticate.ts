import * as jwt from "jsonwebtoken";
import * as mongoose from "mongoose";
import { Request, Response } from "express";

const authenticate = async (req: Request & { user: string }, res: Response, next) => {
  
    try {

        const token = req.header('Authorization').split(' ')[1];
         //Token shouldn't be empty, but just incase it is
     
          jwt.verify(token, process.env.SECRET, function(err, decoded) {
              if(err){
                return res.status(401).json('Token is either Invalid or has expired');
              }else{
                 
                 // console.log(decoded, 'Token decoded');
                 req.user = decoded
                 return next();
                 
              }
            });
    
        
    } catch (error) {
        return res.status(401).json('No Authorisation header');
    }

   
  
  };

  export {authenticate};