import autobind from "autobind-decorator";
import ADChain from "./ADChain";
import ADResponse, {IADResponse} from "./ADResponse";
import ADRequest, {ADRequestOptions, DefaultRequestConfigType} from "./ADRequest";
import ADLogger from "ad-logger"
import ADHttpInterceptor from "./interceptors/ADHttpInterceptor";
import ADHttpError from "./error/ADHttpError";
import {ADClient, ADClientFunction} from './ADClient';


@autobind
export default class ADRest<ResponseBodyType, RequestConfigType = DefaultRequestConfigType> {

    public interceptors: Array<ADHttpInterceptor<ResponseBodyType, RequestConfigType>> = [];

    protected _client: ADClient<ResponseBodyType, RequestConfigType>;
    protected _fetch: ADClientFunction<ResponseBodyType & any, RequestConfigType>;

    constructor(client: ADClient<ResponseBodyType, RequestConfigType>) {
        this._client = client;
        if (typeof client['fetch'] === "function")
            this._fetch = client['fetch'];
        else
            this._fetch = client as any;
    }

    public async process<R extends ResponseBodyType>(
        requestOrUrl: ADRequest<RequestConfigType> | ADRequestOptions<RequestConfigType> | string,
        reqWhenUrl?: ADRequest<RequestConfigType> | ADRequestOptions<RequestConfigType>
    ): Promise<ADResponse<R>> {
        let res;
        if (requestOrUrl instanceof ADRequest) {
            res = await this._process(requestOrUrl, 0);
        } else if (typeof requestOrUrl === 'string') {
            res = await this._process(new ADRequest<RequestConfigType>({url: requestOrUrl, ...reqWhenUrl}), 0);
        } else
            res = await this._process(new ADRequest<RequestConfigType>(requestOrUrl), 0);

        if (res instanceof ADResponse)
            return res;
        return new ADResponse(res);
    }

    protected async _process<R extends ResponseBodyType>(
        originalRequest: ADRequest<RequestConfigType>,
        index: number
    ): Promise<ADResponse<R>> {
        let request: ADRequest<RequestConfigType> = originalRequest.clone();
        if (this.interceptors.length === index) {
            try {
                let res = await this._fetch(request);
                if (res instanceof ADResponse)
                    return res;
                return new ADResponse(res)
            } catch (e) {
                throw new ADHttpError("An error occurred in HttpClient fetch method.\n" + e);
            }
        }

        let i = this.interceptors[index];
        let chain = new ADChain<ResponseBodyType, RequestConfigType>({
            originalRequest,
            request,
            index,
            fetch: async (newRequest: ADRequest<RequestConfigType>, idx) => {
                request = newRequest;
                return this._process(newRequest, idx);
            }
        });

        let name = (i.name || i.constructor.name);
        if (!name || name === "Object")
            name = `Interceptor[${index}]`;

        let response: ADResponse<R> | undefined;
        if (!i.intercept) {
            ADLogger.error(name + " was ignored because dont have `intercept` method.");
        } else {
            ADLogger.info(name + " processing...");
            try {
                if (i.enabled !== false) {
                    let result = i.intercept(chain);
                    response = (result instanceof Promise ? await result : result) as ADResponse<R>;
                    ADLogger.info(name + " process done.");
                } else {
                    ADLogger.info(name + " disabled.");
                }
            } catch (e) {
                if (!(e instanceof ADHttpError))
                    ADLogger.error("An error occurred in " + name + " interceptor.");
                throw e;
            }
        }

        if (response)
            return response;

        if (chain.response !== undefined)
            return chain.response as any;
        else
            return await chain.proceed() as any;
    }

}