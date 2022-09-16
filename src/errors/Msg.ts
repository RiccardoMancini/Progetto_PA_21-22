import { ResponseHttp } from './response';

export interface Msg {
    getMsg(data?:any):ResponseHttp;
}