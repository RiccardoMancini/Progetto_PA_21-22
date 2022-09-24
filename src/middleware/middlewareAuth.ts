import jwt from 'jsonwebtoken';
import { ErrorFactory, ErrEnum } from "../factory/errorFactory";
require('dotenv').config();

enum role{
    ADMIN = 1,
    BID_CREATOR = 2,
    BID_PARTICIPANT = 3
}

/**
* Check che verifica l'effettiva presenza del parametro di autorizzazione
* nell'header della richiesta
* @param req request di express
* @param res response di express
* @param next next di express
*/
export const checkHeader = (req: any, res: any, next: any) => {
    try{
        const aHeader = req.headers.authorization;
        if(aHeader) next();
        else throw new ErrorFactory().getError(ErrEnum.HeaderNotFound);
    }
    catch(err){
        next(err);
    }
    

};

/**
* Check del bearer header affinchè sia corretto
* @param req request di express
* @param res response di express
* @param next next di express
*/
export const checkToken = (req: any, res: any, next: any) => {
    try{
        const bearerHeader = req.headers.authorization;
        if(typeof bearerHeader !== 'undefined'){
            const bearerToken = bearerHeader.split(' ')[1];
            req.token = bearerToken;            
            next();
        }
        else throw new ErrorFactory().getError(ErrEnum.InvalidHeaderFormat);
    }
    catch(err){
        next(err);
    }
};

/**
* Check dell'effettiva autenticazione dell'utente
* @param req request di express
* @param res response di express
* @param next next di express
*/
export const checkAuthentication = (req: any, res: any, next: any) => {
    try{
        let decoded = jwt.verify(req.token, process.env.SECRET_KEY);
        if(decoded !== null){
            if(decoded.role === 1 || decoded.role === 2 || decoded.role === 3){
                req.user_id = decoded.id;                
                next();
            }
            else throw new ErrorFactory().getError(ErrEnum.Unauthorized);
        }
    }
    catch(err){
        next(err);
    }
};

/**
* Check dei privilegi di Admin dell'utente autenticato
* @param req request di express
* @param res response di express
* @param next next di express
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
* Check dei privilegi di BidCreator dell'utente autenticato
* @param req request di express
* @param res response di express
* @param next next di express
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
* Check dei privilegi di BidParticipant dell'utente autenticato
* @param req request di express
* @param res response di express
* @param next next di express
*/
export const isBidParticipant = (req: any, res: any, next: any) => {
    try{
        let decoded = jwt.verify(req.token, process.env.SECRET_KEY);    
        if(decoded !== null && (decoded.role === role.BID_PARTICIPANT)){
            next();
        }
        else throw new ErrorFactory().getError(ErrEnum.Unauthorized);
    }
    catch(err){
        next(err);
    }
}