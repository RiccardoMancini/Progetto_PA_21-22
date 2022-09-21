/**
 * Classe  che contiene le chiavi necessarie a comporre 
 * gli oggetti da passare ai metodi delle classi oppure come risposta
 */
export class ObjectBuilder{
    private asta_id: number;
    private user_id: number;
    private part_id: number;
    private chiavi_id: number;
    private p_min: number;
    private credito: number;
    private new_credito: number;
    private offerta: number;
    private rilanci_offerta: number;
    private addebito: number;
    private offerta_addebito: number;
    private aggiudicata: boolean;
    private stato: number;
    private tipo: number;
    private data_i: string;
    private data_f: string;
    private messaggio: string;
    private partecipazioni: Array<ObjectBuilder>;

    constructor(){
        this.partecipazioni = [];
    }



    //getter e setter per ogni attributo dichiarato

    getAstaID():number{
        return this.asta_id;
    }

    getUserID():number{
        return this.user_id;
    }

    getPartID(): number{
        return this.part_id;
    }

    getChiaviID(): number{
        return this.chiavi_id;
    }

    getBaseAsta(): number{
        return this.p_min;
    }

    getCredito():number{
        return this.credito;
    }

    getNewCredito():number{
        return this.new_credito;
    }

    getOfferta():number{
        return this.offerta
    }

    getRilanci_Offerta():number{
        return this.rilanci_offerta;
    }

    getAddebito():number{
        return this.addebito;
    }

    getOfferta_Addebito():number{
        return this.offerta_addebito;
    }

    getAggiudicata(): boolean{
        return this.aggiudicata;
    }

    getStato():number{
        return this.stato;
    }

    getTipo():number{
        return this.tipo;
    }

    getDataI():string{
        return this.data_i;
    }

    getDataF():string{
        return this.data_f;
    }

    getMessaggio():string{
        return this.messaggio;
    }

    getPartecipazioni(): Array<any>{
        return this.partecipazioni;
    }

    







    setAstaID(asta_id: number){
        this.asta_id = asta_id;
        return this;
    }

    setUserID(user_id: number){
        this.user_id = user_id;
        return this;
    }

    setPartID(part_id: number){
        this.part_id = part_id;
        return this;
    }

    setChiaviID(chiavi_id: number){
        this.chiavi_id = chiavi_id;
        return this;
    }

    setBaseAsta(base_asta: number){
        this.p_min = base_asta;
        return this;
    }

    setCredito(credito: number){
        this.credito = credito;
        return this;
    }

    setNewCredito(new_credito: number){
        this.new_credito = new_credito;
        return this;
    }

    setOfferta(offerta: number){
        this.offerta = offerta;
        return this;
    }

    setPartecipazioni(objBuilded: ObjectBuilder){
        this.partecipazioni.push(objBuilded);
        return this;
    }

    setRilanci_Offerta(rilanci_offerta: number){
        this.rilanci_offerta = rilanci_offerta;
        return this;
    }

    setAddebito(addebito: number){
        this.addebito = addebito;
        return this;
    }

    setOfferta_Addebito(offerta_addebito: number){
        this.offerta_addebito = offerta_addebito;
        return this;
    }

    setAggiudicata(aggiudicata: boolean){
        this.aggiudicata = aggiudicata;
        return this;
    }

    setStato(stato: number){
        this.stato = stato;
        return this;
    }

    setTipo(tipo: number){
        this.tipo = tipo;
        return this;
    }

    setDataI(data_i: string){
        this.data_i = data_i;
        return this;
    }

    setDataF(data_f: string){
        this.data_f = data_f;
        return this;
    }

    setMessaggio(messaggio: string){
        this.messaggio = messaggio;
        return this;
    }
    
    //Restituisce l'oggetto costruito
    build() {
        return this;
    }
}