import * as jwt from "jsonwebtoken";
import * as mongoose from "mongoose";
import { Request, Response } from "express";


type MyToken = {
  email: string
  iat: number
  exp: number
}

export const generateToken = username =>
  !username
    ? null
    : `${jwt.sign(
        {

          email: username,
          iat: Math.floor(Date.now() / 1000) - 30,
          //exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60
        },
       process.env.SECRET,
       { expiresIn: '1m' }
      )}`;


/**
 * Authenticates a request by checking the authorization header. If successful,
 * it adds the user object to the request object and allows the request to
 * proceed. Else, it returns a 401 error with the appropriate message.
 *
 * @param req Request
 * @param res Response
 * @param next
 * @returns {Promise<*>}
 */



export default {
  generateToken
};
