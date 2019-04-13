import Chain from '../ADChain';
import ADStatusError from '../error/ADStatusError';
import ADResponse from '../ADResponse';
import ADBaseHttpInterceptor from "./ADBaseHttpInterceptor";
import autobind from "autobind-decorator";
import {ADRequestData, ADRequestFile, ADRequestFiles, ADRequestHeaders} from "../ADRequest";

export type ADPrepareRequestInterceptorOptions = {
    removeNull?: boolean
    removeUndefined?: boolean
}
@autobind
export default class ADPrepareRequestInterceptor
    extends ADBaseHttpInterceptor<ADPrepareRequestInterceptorOptions> {


    constructor(options: ADPrepareRequestInterceptorOptions = {}) {
        super({
            ...{
                removeNull: true,
                removeUndefined: true
            },
            ...options
        })
    }

    async intercept<T>(chain: Chain<T>): Promise<ADResponse<T>> {
        let req = chain.request
            .edit();
        if (chain.request.data)
            req.data(await this.mapAll(chain.request.data));
        if (chain.request.params)
            req.params(await this.mapAll(chain.request.params));
        if (chain.request.headers)
            req.headers(await this.mapAll(chain.request.headers));
        if (chain.request.files)
            req.files(await this.mapAll(chain.request.files));

        return await chain.proceed(req.build());
    }

    mapBoolean(value: boolean) {
        return value ? 1 : 0;
    }

    mapNumber(value: number) {
        return value
    }

    mapObject(value: object) {
        return JSON.stringify(value);
    }


    mapString(value: string) {
        return value;
    }

    mapOther(value: any) {
        return value;
    }

    mapFunction(value: Function) {
        return value.call(null);
    }

    protected async mapAll<T extends (ADRequestData | ADRequestHeaders | ADRequestFiles)>(data: T): Promise<T> {
        for (let key in data) {
            let value: any = data[key];
            value = this.mapValue(value);
            if (
                (value === undefined && this.options.removeUndefined) ||
                (value === null && this.options.removeNull)
            ) {
                delete data[key];
            } else
                data[key] = value;
        }
        return data;
    }

    protected async mapValue(value: any): Promise<any> {
        let type = typeof value;
        if (type === 'boolean') {
            value = this.mapBoolean(value);
        } else if (type === 'number') {
            value = this.mapNumber(value)
        } else if (type === 'string') {
            value = this.mapString(value)
        } else if (type === 'object') {
            value = this.mapObject(value)
        } else if (type === 'function') {
            value = this.mapFunction(value)
        } else
            value = this.mapOther(value);

        return (value instanceof Promise) ? await value : value;
    }
}