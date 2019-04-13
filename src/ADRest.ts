import autobind from "autobind-decorator";
import ADChain from "./ADChain";
import ADResponse from "./ADResponse";
import ADRequest from "./ADRequest";
import ADClient from "./ADClient";
import ADLogger from "ad-logger"
import ADHttpInterceptor from "./interceptors/ADHttpInterceptor";
import ADHttpError from "./error/ADHttpError";
import ADNormalClient from "./ADNormalClient";


@autobind
export default class ADRest<BaseResponse> {

    public interceptors: Array<ADHttpInterceptor<BaseResponse>> = [];

    protected _client: ADClient;

    constructor(client: ADClient = new ADNormalClient()) {
        this._client = client
    }

    public async process<R extends BaseResponse>(originalRequest: ADRequest): Promise<ADResponse<R>> {
        return this._process(originalRequest, 0)
    }

    protected async _process<R extends BaseResponse>(originalRequest: ADRequest, index): Promise<ADResponse<R>> {
        let request = originalRequest.clone();
        if (this.interceptors.length === index) {
            try {
                return await this._client.fetch<R>(request);
            } catch (e) {
                throw new ADHttpError("An error occurred in HttpClient fetch method.\n" + e);
            }
        }

        let i = this.interceptors[index];
        let chain = new ADChain({
            originalRequest,
            request,
            index,
            fetch: async (newRequest, idx) => {
                request = newRequest;
                return this._process(newRequest, idx);
            }
        });

        // consoleIntent(index*4)
        // log(`${index+1} ${request.url} start`)
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

        // log(` ${index+1} ${request.url} end`)


        if (response)
            return response;

        if (chain.response !== undefined)
            return chain.response as any;
        else
            return await chain.proceed() as any;
    }

}