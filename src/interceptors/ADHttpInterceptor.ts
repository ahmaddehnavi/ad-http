import Chain from '../ADChain';
import ADResponse from "../ADResponse";

export type ADHttpInterceptorInterceptReturn<ResponseBodyType> = ADResponse<ResponseBodyType> |
    Promise<ADResponse<ResponseBodyType>> |
    void |
    Promise<void>

export default interface ADHttpInterceptor<ResponseBodyType = any, RequestConfigType = never> {
    enabled?: boolean
    name?: string

    intercept(chain: Chain<ResponseBodyType, RequestConfigType>): ADHttpInterceptorInterceptReturn<ResponseBodyType>
}