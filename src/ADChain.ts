import autobind from 'autobind-decorator';
import ADResponse from './ADResponse';
import ADRequest from './ADRequest';

export type Fetch<T> = (request: ADRequest, index: number) => Promise<ADResponse<T>>

@autobind
export default class Chain<T> {
    protected _fetch: Fetch<T>;
    protected _originalRequest: ADRequest;
    protected _index: number;
    private _lastResponse?: ADResponse<T>;

    constructor(p: { originalRequest: ADRequest, request: ADRequest, index: number, fetch: Fetch<T> }) {
        this._fetch = p.fetch;
        this._request = p.request;
        this._originalRequest = p.originalRequest;
        this._index = p.index;
    }

    protected _request: ADRequest;

    get request(): ADRequest {
        return this._request
    }

    get response() {
        return this._lastResponse
    }

    async proceed(req: ADRequest = this.request): Promise<ADResponse<T>> {
        this._lastResponse = await this._fetch(req, this._index + 1);
        return this._lastResponse
    }

    reset() {
        this._request = this._originalRequest.clone();
        this._index = -1;
        return this;
    }
}
