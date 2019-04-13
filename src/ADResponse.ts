import autobind from 'autobind-decorator';

export type Headers = { [key: string]: string };
export type ResponseBody = string | object | {
    json?: () => Promise<object>
    text?: () => Promise<string>
    blob?: () => Promise<Blob>
}

@autobind
export default class ADResponse<T> {
    protected _jsonCache?: T;
    protected _textCache?: string;
    protected _blobCache?: any;

    constructor(p: { body: ResponseBody, headers: Headers, status: number, statusText: string }) {
        this._body = p.body;
        this._status = p.status;
        this._statusText = p.statusText;
        this._headers = p.headers
    }

    protected _body: ResponseBody | any;

    get body() {
        return this._body
    }

    protected _headers: Headers;

    get headers() {
        return this._headers || {}
    }

    protected _status: number;

    get status() {
        return this._status
    }

    protected _statusText: string;

    get statusText() {
        return this._statusText || ''
    }

    async json(): Promise<T> {
        if (this._jsonCache)
            return this._jsonCache;

        if (typeof this._body.json === 'function')
            return this._jsonCache = await this._body.json();

        if (typeof this._body === 'string')
            return this._jsonCache = JSON.parse(this._body);

        if (typeof this._body === 'object')
            return this._jsonCache = this._body;

        throw new Error('Bad ADResponse Error.');
    }

    async text() {
        if (this._textCache)
            return this._textCache;

        if (typeof this._body.text === 'function')
            return this._textCache = await this._body.text();

        if (typeof this._body === 'string')
            return this._textCache = this._body;

        if (typeof this._body === 'object')
            return this._textCache = JSON.stringify(this._body);

        throw new Error('Bad ADResponse Error.');
    }

    async blob() {
        if (this._blobCache)
            return this._blobCache;

        if (typeof this._body.blob === 'function')
            return this._blobCache = await this._body.blob();

        throw new Error('Bad ADResponse Error.');
    }

}
