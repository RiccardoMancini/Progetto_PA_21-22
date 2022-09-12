import {ErrEnum} from "../errors/errfactory";

export const errHandler = (e:ErrEnum,res,req,next)=>{
    const err = ErrorFactory.getError(e)


}