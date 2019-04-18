import Chain from '../ADChain';
import ADResponse from '../ADResponse';
import ADBaseHttpInterceptor from "./ADBaseHttpInterceptor";

export type ADBaseUrlInterceptorsOptions = {
    baseUrl: string
}
export default class ADBaseUrlHttpInterceptor
    extends ADBaseHttpInterceptor<ADBaseUrlInterceptorsOptions> {


    constructor(options: ADBaseUrlInterceptorsOptions | string) {
        super(typeof options === 'string' ? {baseUrl: options} : options);
        if (!this.options.baseUrl.endsWith('/'))
            this.options.baseUrl = this.options.baseUrl + '/';
    }

    async intercept<T>(chain: Chain<T, any>): Promise<ADResponse<T>> {

        if (!chain.request.url.includes('://')) {
            let url = chain.request.url;
            let req = chain.request
                .edit()
                .url(
                    this.options.baseUrl + (
                        url[0] === '/' ? url.substr(1) : url
                    )
                )
                .build();
            return chain.proceed(req)
        }
        return chain.proceed()
    }

}