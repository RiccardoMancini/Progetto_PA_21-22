export interface UtentiInterface{

    getUserByID(user_id: number): Promise<any|null>;
    getCreditoByUserID(user_id: number): Promise<any>;
    updateCreditoUtente(...args: any): Promise<any>;
}