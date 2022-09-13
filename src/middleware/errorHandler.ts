import { ErrorFactory,ErrEnum } from "../errors/errorfactory";


export const errorHandler =  (e: ErrEnum, req: any, res: any, next: any) => {
    const err_msg = new ErrorFactory().getError(e);
    console.log(err_msg);
    res.status(err_msg.status).json({Error: err_msg.status, Description:err_msg.message});
};

