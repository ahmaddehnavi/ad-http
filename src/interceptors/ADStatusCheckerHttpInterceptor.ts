import Chain from '../ADChain';
import ADStatusError from '../error/ADStatusError';
import ADResponse from '../ADResponse';
import ADBaseHttpInterceptor from "./ADBaseHttpInterceptor";

export type ADHttpStatusCheckerInterceptorsOptions = {
    min?: number
    max?: number
    isValid?: (status: number) => boolean
}
export default class ADStatusCheckerHttpInterceptor
    extends ADBaseHttpInterceptor<ADHttpStatusCheckerInterceptorsOptions> {
    options: ADHttpStatusCheckerInterceptorsOptions = {
        max: 299,
        min: 200
    };


    constructor(options: ADHttpStatusCheckerInterceptorsOptions = {}) {
        super(options)
    }

    async intercept<T>(chain: Chain<T>): Promise<ADResponse<T>> {
        let response = await chain.proceed();
        if (this.options.isValid) {
            if (this.options.isValid(response.status))
                return response;
        }

        let validMin = false;
        if (!this.options.min || response.status >= this.options.min) {
            validMin = true
        }

        if (validMin && this.options.max &&
            response.status <= this.options.max) {
            return response
        }

        throw new ADStatusError(response.statusText || 'Http Error');
    }

}