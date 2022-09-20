import jwt from 'jsonwebtoken';
import { ErrorFactory, ErrEnum } from "../factory/errorFactory";
require('dotenv').config();

enum role{
    ADMIN = 1,
    BID_CREATOR = 2,
    BID_PARTICIPANT = 3
}

/**
 * Check della presenza del parametro di autorizzazione
 */
export const checkHeader = (req: any, res: any, next: any) => {
    try{
        const aHeader = req.headers.authorization;
        if(aHeader) next();
        else throw new ErrorFactory().getError(ErrEnum.BadRequest);
    }
    catch(err){
        next(err);
    }
    

};

/**
 * Funzione che fa il check della bearerHeader
 */
export const checkToken = (req: any, res: any, next: any) => {
    try{
        const bearerHeader = req.headers.authorization;
        if(typeof bearerHeader !== 'undefined'){
            const bearerToken = bearerHeader.split(' ')[1];
            req.token = bearerToken;            
            next();
        }
        else throw new ErrorFactory().getError(ErrEnum.BadRequest);
    }
    catch(err){
        next(err);
    }
};

/**
 * Funzione che verifica l'admin
 */
export const isAdmin = (req: any, res: any, next: any) => {
    try{
        let decoded = jwt.verify(req.token, process.env.SECRET_KEY);    
        if(decoded !== null && (decoded.role === role.ADMIN)){
            next();
        }
        else throw new ErrorFactory().getError(ErrEnum.Unauthorized);
    }
    catch(err){
        next(err);
    }
}

/**
 * Funzione che verifica il BidCreator
 */
 export const isBidCreator = (req: any, res: any, next: any) => {
    try{
        let decoded = jwt.verify(req.token, process.env.SECRET_KEY);    
        if(decoded !== null && (decoded.role === role.BID_CREATOR)){
            next();
        }
        else throw new ErrorFactory().getError(ErrEnum.Unauthorized);
    }
    catch(err){
        next(err);
    }
 }
    

/**
 * Funzione che verifica BidParticipant 
 */
export const isBidParticipant = (req: any, res: any, next: any) => {
    try{
        let decoded = jwt.verify(req.token, process.env.SECRET_KEY);    
        if(decoded !== null && (decoded.role === role.BID_PARTICIPANT)) {
            req.user_id = decoded.id;
            next();
        }
        else throw new ErrorFactory().getError(ErrEnum.Unauthorized);
    }
    catch(err){
        next(err);
    }
}