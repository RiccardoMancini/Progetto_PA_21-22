export interface UtentiInterface{

    getUserByID(user_id: number): Promise<any|null>;
    getCreditoByUserID(user_id: number): Promise<any|null>;
    updateCreditoUtente(user_id: number, credito: number): Promise<any>;
}