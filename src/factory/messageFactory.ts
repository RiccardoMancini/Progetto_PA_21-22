export class Message {
    type: MessageCode; 
    message: string;
    offerta?: number;
    asta_id?: number;
    base_asta?: number;
    constructor(message: string) {
        this.message = message;
    }
}

class WelcomeMsg extends Message {
    constructor(offerta: number, asta_id: number, base_asta: number) {
        super("Benvenuto nell'asta numero:");
        this.type = MessageCode.WELCOME;
        this.offerta = offerta;
        this.asta_id = asta_id;
        this.base_asta = base_asta;


    }
}

class ClientCheckMsg extends Message {
    constructor() {
        super("");
        this.type = MessageCode.CLIENT_CHECK;

    }
}

class TooLateMsg extends Message {
    constructor() {
        super("Troppo tardi l'asta è iniziata... Connessione rifiutata!");
        this.type = MessageCode.TOO_LATE;

    }
}

class PreStartMsg extends Message {
    constructor() {
        super("L'asta comincerà tra qualche secondo!");
        this.type = MessageCode.PRE_START;

    }
}

class StartMsg extends Message {
    constructor(base_asta: number) {
        super("Execute order");
        this.type = MessageCode.START;
        this.offerta = base_asta;

    }
}

class OfferMsg extends Message {
    constructor(offerta: number) {
        super("Execute order");
        this.type = MessageCode.OFFER;
        this.offerta = offerta;

    }
}

class WaitMsg extends Message {
    constructor() {
        super("Aspetta!");
        this.type = MessageCode.WAIT;

    }
}

class NoCreditMsg extends Message {
    constructor() {
        super("");
        this.type = MessageCode.NO_CREDIT;

    }
}

class CloseMsg extends Message {
    constructor() {
        super("Grazie per la partecipazione!");
        this.type = MessageCode.CLOSE;

    }
}

class winnerMsg extends Message {
    constructor(bestOffer: number) {
        super("Complimenti sei il vincitore di questa asta! L'hai aggiudicata con un'offerta pari a: ");
        this.type = MessageCode.WINNER;
        this.offerta = bestOffer;

    }
}


export enum MessageCode {
    WELCOME,
    CLIENT_CHECK,
    TOO_LATE,
    PRE_START,
    START,
    OFFER,
    WAIT,
    NO_CREDIT,
    CLOSE,
    WINNER
}


class FactoryMsg {
    getMessage(type: MessageCode, offerta?: number, asta_id?: number, base_asta?: number): Message {
        let msg: Message = new Message("An error occured");
        switch (type) {
            case MessageCode.WELCOME:
                msg = new WelcomeMsg(offerta, asta_id, base_asta);
                break;
            case MessageCode.CLIENT_CHECK:
                msg = new ClientCheckMsg();
                break;
            case MessageCode.TOO_LATE:
                msg = new TooLateMsg();
                break;
            case MessageCode.PRE_START:
                msg = new PreStartMsg();
                break;
            case MessageCode.START:
                msg = new StartMsg(offerta);
                break;                
            case MessageCode.OFFER:
                msg = new OfferMsg(offerta);
                break;
            case MessageCode.WAIT:
                msg = new WaitMsg();
                break;
            case MessageCode.NO_CREDIT:
                msg = new NoCreditMsg();
                break;
            case MessageCode.CLOSE:
                msg = new CloseMsg();
                break;
            case MessageCode.WINNER:
                msg = new winnerMsg(offerta);
                break;
            default:
                break;
        }
        return msg;
    }
}

export const factoryMsg = new FactoryMsg();