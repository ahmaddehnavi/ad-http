import autobind from 'autobind-decorator';

type Primitive = string | number | boolean
type ValueOrGenerator<T> = T | Promise<T> | (() => T) | (() => Promise<T>) | undefined
export type ADRequestFile = { name: string, uri: string, type: string }
export type ADRequestParams = { [key: string]: ValueOrGenerator<Primitive> }
export type ADPreparedRequestParams = { [key: string]: Primitive }
export type ADRequestData = { [key: string]: ValueOrGenerator<Primitive> }
export type ADPreparedRequestData = { [key: string]: Primitive }
export type ADRequestFiles = { [key: string]: ValueOrGenerator<ADRequestFile> };
export type ADPreparedRequestFiles = { [key: string]: ADRequestFile };
export type ADRequestHeaders = { [key: string]: ValueOrGenerator<string> };
export type ADPreparedRequestHeaders = { [key: string]: string };
export type ADRequestMethod = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'delete' | 'DELETE'

export type ADRequestOptions<RequestConfigType = never> = {
    url: string,
    method?: ADRequestMethod,
    params?: ADRequestParams,
    data?: ADRequestData,
    files?: ADRequestFiles,
    headers?: ADRequestHeaders
    config?: RequestConfigType
}

export type DefaultRequestConfigType = { [key: string]: any }

class Builder<RequestConfigType = DefaultRequestConfigType> {
    private _url?: string;
    private _method?: ADRequestMethod;
    private _params?: ADRequestParams;
    private _data?: ADRequestData;
    private _files?: ADRequestFiles;
    private _headers?: ADRequestHeaders;
    private _config?: RequestConfigType;

    constructor(p: Partial<ADRequest<RequestConfigType>> = {}) {
        this._url = p.url;
        this._method = p.method;
        this._params = p.params;
        this._data = p.data;
        this._files = p.files;
        this._headers = p.headers;
        this._config = p.config
    }

    static from<ConfigType>(p: ADRequest<ConfigType>) {
        return new ADRequest.Builder<ConfigType>(p);
    }

    url(value: string) {
        this._url = value;
        return this;
    }

    method(value: ADRequestMethod) {
        this._method = value;
        return this;
    }

    params(value: ADRequestParams) {
        this._params = value;
        return this;
    }

    param(name: string, value: ValueOrGenerator<Primitive>) {
        if (!this._params)
            this._params = {};
        this._params[name] = value;
        return this;
    }

    data(nameOrValues: ADRequestData | string, value?: ValueOrGenerator<Primitive>) {
        if (typeof nameOrValues === 'string') {
            if (!this._data)
                this._data = {};
            this._data[name] = value
        } else {
            this._data = nameOrValues;
        }
        return this;
    }

    files(value: ADRequestFiles) {
        this._files = value;
        return this;
    }

    file(name: string, value: ValueOrGenerator<ADRequestFile>) {
        if (!this._files)
            this._files = {};
        this._files[name] = value;
        return this;
    }

    headers(value: ADRequestHeaders) {
        this._headers = value;
        return this;
    }

    header(name: string, value: ValueOrGenerator<string>) {
        if (!this._headers)
            this._headers = {};
        this._headers[name] = value;
        return this;
    }

    build() {
        return new ADRequest({
            url: this._url || '',
            method: this._method,
            params: this._params,
            data: this._data,
            files: this._files,
            headers: this._headers,
        });
    }
}

@autobind
export default class ADRequest<RequestConfigType = DefaultRequestConfigType> {
    public static Builder = Builder;
    private readonly _options: ADRequestOptions<RequestConfigType>;

    constructor(p: ADRequestOptions<RequestConfigType>) {
        this._options = p;
    }

    public get url() {
        return this._options.url || ''
    }

    public get method() {
        return this._options.method
    }

    public get params() {
        return this._options.params || {}
    }

    public get data() {
        return this._options.data || {}
    }

    public get files() {
        return this._options.files || {}
    }

    public get headers() {
        return this._options.headers || {}
    }

    public get config() {
        return this._options.config
    }

    public static post = (url: string, data?: ADRequestData) => {
        return new ADRequest({url, data, method: 'post'});
    };

    public static get = (url: string, data?: ADRequestData) => {
        return new ADRequest({url, data, method: 'get'})
    };

    edit(): Builder<RequestConfigType> {
        return ADRequest.Builder.from(this);
    }

    clone(): ADRequest<RequestConfigType> {
        return new ADRequest({
            url: this.url,
            method: this.method,
            params: {...this.params},
            data: {...this.data},
            files: {...this.files},
            headers: {...this.headers}
        });
    }
}
