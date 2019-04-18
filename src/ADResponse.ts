import autobind from 'autobind-decorator';

export type Headers = { [key: string]: string };

export interface IADResponse<ResponseBodyType> {
    body: ValueOrCreator<ResponseBodyType>,
    headers: Headers,
    status: number,
    statusText: string
}


type ValueOrCreator<T> =
    T |
    Promise<T> |
    (() => T) |
    (() => Promise<T>)

@autobind
export default class ADResponse<ResponseBodyType> implements IADResponse<ResponseBodyType> {

    private _options: IADResponse<ResponseBodyType>;

    constructor(p: IADResponse<ResponseBodyType>) {
        this._options = p || {}
    }


    get headers() {
        return this._options.headers || {}
    }


    get status() {
        return this._options.status
    }


    get statusText() {
        return this._options.statusText || ''
    }

    async body(): Promise<ResponseBodyType> {
        let body = this._options.body;
        if (typeof body === 'function') {
            return (body as Function).call(null)
        }
        return body;
    }

}
