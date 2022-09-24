import { HttpError, ErrorFactory, ErrEnum } from "../factory/errorFactory";

/**
 * Log degli errori in console
 * @param err errore sollevato
 * @param req request di express
 * @param res response di express
 * @param next next di express
 */
export const errorLog = (err: HttpError, req: any, res: any, next: any) => {
    console.log(err.stack);
    next(err)
}

/**
 * Risposta con l'errore sollevato
 * @param err errore sollevato
 * @param req request di express
 * @param res response di express
 * @param next next di express
 */
export const errorHandler =  (err: HttpError, req: any, res: any, next: any) => {
    if(Number.isInteger(err.status)){
        res.status(err.status).send(err.stack);
    } 
    else{
        res.status(ErrEnum.InternalServerError).send(err.stack);
    }
};

