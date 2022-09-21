import { ObjectBuilder } from "./objectBuilder";
/**
 * Classe  che contiene le chiavi necessarie a comporre 
 * gli oggetti da passare ai metodi delle classi oppure come risposta
 */
export class ObjectConstr {

    private asta_id: number;
    private user_id: number;
    private chiavi_id: number;
    private base_asta: number;
    private credito: number;
    private new_credito: number;
    private rilanci_offerta: number;
    private addebito: number;
    private offerta_addebito: number;
    private aggiudicata: boolean;
    private stato: number;
    private tipo: number;
    private data_i: string;
    private data_f: string;
    private messaggio: string;

    constructor(objectBuild: ObjectBuilder) {
        this.asta_id = objectBuild.getAstaID();
        this.user_id = objectBuild.getUserID();
        this.chiavi_id = objectBuild.getChiaviID();
        this.base_asta = objectBuild.getBaseAsta();
        this.credito = objectBuild.getCredito();
        this.new_credito = objectBuild.getNewCredito();
        this.rilanci_offerta = objectBuild.getRilanci_Offerta();
        this.addebito = objectBuild.getAddebito();
        this.offerta_addebito = objectBuild.getOfferta_Addebito();
        this.aggiudicata = objectBuild.getAggiudicata();
        this.stato = objectBuild.getStato();
        this.tipo = objectBuild.getTipo();
        this.data_i = objectBuild.getDataI();
        this.data_f = objectBuild.getDataF();
        this.messaggio = objectBuild.getMessaggio();
    }

    /*public getStatusCode():number{
        return this.status_code;
    }*/
}