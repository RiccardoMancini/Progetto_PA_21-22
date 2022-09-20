import { HttpError, ErrorFactory, ErrEnum } from "../factory/errorFactory";


export const errorLog = (err: HttpError, req: any, res: any, next: any) => {
    console.log(err.stack);
    next(err)
}

export const errorHandler =  (err: HttpError, req: any, res: any, next: any) => {
    if(Number.isInteger(err.status)){
        res.status(err.status).send(err.stack);
    } 
    else{
        res.status(ErrEnum.InternalServerError).send(err.stack);
    }
};

