import autobind from 'autobind-decorator';
import ADResponse, {IADResponse} from './ADResponse';
import ADRequest, {DefaultRequestConfigType} from './ADRequest';

export type Fetch<ResBody, ReqConfig = DefaultRequestConfigType> = (request: ADRequest<ReqConfig>, index: number) =>
    Promise<ADResponse<ResBody>>

@autobind
export default class Chain<ResponseBodyType, RequestConfigType = DefaultRequestConfigType> {
    protected _fetch: Fetch<ResponseBodyType, RequestConfigType>;
    protected _originalRequest: ADRequest<RequestConfigType>;
    protected _index: number;
    private _lastResponse?: ADResponse<ResponseBodyType>;

    constructor(p: {
        originalRequest: ADRequest<RequestConfigType>,
        request: ADRequest<RequestConfigType>,
        index: number,
        fetch: Fetch<ResponseBodyType, RequestConfigType>
    }) {
        this._fetch = p.fetch;
        this._request = p.request;
        this._originalRequest = p.originalRequest;
        this._index = p.index;
    }

    protected _request: ADRequest<RequestConfigType>;

    get request(): ADRequest<RequestConfigType> {
        return this._request
    }

    get response() {
        return this._lastResponse
    }

    async proceed(req: ADRequest<RequestConfigType> = this.request):
        Promise<ADResponse<ResponseBodyType>> {
        this._lastResponse = await this._fetch(req, this._index + 1);
        return this._lastResponse
    }

    reset() {
        this._request = this._originalRequest.clone();
        this._index = -1;
        return this;
    }
}
