export class HttpError extends Error{
    message: string;
    status: number;
    
    constructor(message: string, status: number){
        super(message);
        this.message = message;
        this.status = status;
    }
}

class HeaderNotFound extends HttpError{
    constructor(){
        super('Header della richiesta mancante!', ErrEnum.BadRequest);
    }
}

class InvalidHeaderFormat extends HttpError{
    constructor(){
        super('Formato header non valido!', ErrEnum.BadRequest);
    }
}



class AstaNotCreate extends HttpError{
    constructor(){
        super('Creazione asta non riuscita', ErrEnum.BadRequest);
    }
    
}

class UserNotFound extends HttpError{
    constructor(){
        super('Utente non trovato!', ErrEnum.NotFound);
    }
}

class AstaNotFound extends HttpError{
    constructor(){
        super('Asta non trovata!', ErrEnum.NotFound);
    }
}

class BadFormattedData extends HttpError{
    constructor(){
        super('I dati presenti nel body della richiesta non sono corretti!', ErrEnum.BadRequest);
    }
}

class InvalidDate extends HttpError{
    constructor(){
        super('Le date presenti nella richiesta non sono corrette!', ErrEnum.BadRequest);
    }
}

class BadCriptedData extends HttpError{
    constructor(){
        super('I dati criptati nel body della richiesta non sono corretti!', ErrEnum.BadRequest);
    }
}

class BadDecodeKey extends HttpError{
    constructor(){
        super('Chiave di decodifica non corretta!', ErrEnum.BadRequest);
    }
}

class TooEarlyToOpen extends HttpError{
    constructor(){
        super("Troppo presto per aprire l'asta!", ErrEnum.UnprocessableContent);
    }
}

class TooEarlyToClose extends HttpError{
    constructor(){
        super("Troppo presto per chiudere l'asta!", ErrEnum.UnprocessableContent);
    }
}

class OfferAlreadyExist extends HttpError{
    constructor(){
        super("Offerta già fatta per quest'asta!", ErrEnum.UnprocessableContent);
    }
}

class TooLowOfferOrCredit extends HttpError{
    constructor(){
        super("Credito non suffiiciente o offerta troppo bassa!", ErrEnum.UnprocessableContent);
    }
}

class TooLateToOffer extends HttpError{
    constructor(){
        super("Troppo tardi, l'asta è terminata!", ErrEnum.UnprocessableContent);
    }
}

class Unauthorized extends HttpError{
    constructor(){
        super('Utente non autenticato!', ErrEnum.Unauthorized);
    }
}

class Forbidden extends HttpError{
    constructor(){
        super('Utente non autorizzato!', ErrEnum.Forbidden);
    }
}

class UnprocessableContent extends HttpError{
    constructor(){
        super('Impossibile elaborare tali istruzioni!', ErrEnum.UnprocessableContent);
    }    
}

class BadRequest extends HttpError{
    constructor(){
        super('Richiesta non valida!', ErrEnum.BadRequest);
    }    
}

class InternalServerError extends HttpError{
    constructor(){
        super('Errore interno al server!', ErrEnum.InternalServerError);
    }    
}




export enum ErrEnum {
    HeaderNotFound,
    InvalidHeaderFormat,
    UserNotFound,
    AstaNotFound,
    BadFormattedData,
    InvalidDate,
    BadCriptedData,
    BadDecodeKey,
    TooEarlyToOpen,
    TooEarlyToClose,
    OfferAlreadyExist,
    TooLowOfferOrCredit,
    TooLateToOffer,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    UnprocessableContent = 422,
    InternalServerError = 500
}

export class ErrorFactory {
    constructor(){}
    getError (type:ErrEnum):HttpError{
        let retval:HttpError = null;
        switch (type){
            case ErrEnum.HeaderNotFound:
                retval = new HeaderNotFound();
                break;
            case ErrEnum.InvalidHeaderFormat:
                retval = new InvalidHeaderFormat();
                break;
            case ErrEnum.UserNotFound:
                retval = new UserNotFound();
                break;
            case ErrEnum.AstaNotFound:
                retval = new AstaNotFound();
                break;
            case ErrEnum.BadFormattedData:
                retval = new BadFormattedData();
                break;
            case ErrEnum.InvalidDate:
                retval = new InvalidDate();
                break;
            case ErrEnum.BadCriptedData:
                retval = new BadCriptedData();
                break;
            case ErrEnum.BadDecodeKey:
                retval = new BadDecodeKey();
                break;
            case ErrEnum.TooEarlyToOpen:
                retval = new TooEarlyToOpen();
                break;
            case ErrEnum.TooEarlyToClose:
                retval = new TooEarlyToClose();
                break;
            case ErrEnum.OfferAlreadyExist:
                retval = new OfferAlreadyExist();
                break;
            case ErrEnum.TooLowOfferOrCredit:
                retval = new TooLowOfferOrCredit();
                break;
            case ErrEnum.TooLateToOffer:
                retval = new TooLateToOffer();
                break;
            case ErrEnum.Unauthorized:
                retval = new Unauthorized();
                break;
            case ErrEnum.Forbidden:
                retval = new Forbidden();
                break;
            case ErrEnum.UnprocessableContent:
                retval = new UnprocessableContent();
                break;
            case ErrEnum.BadRequest:
                retval = new BadRequest();
                break;  
            default:
                retval = new InternalServerError();
                break;              
        }
        return retval;
    }
}