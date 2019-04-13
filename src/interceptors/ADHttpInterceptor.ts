import Chain from '../ADChain';
import ADResponse from "../ADResponse";

export type ADHttpInterceptorInterceptReturn<T> = ADResponse<T> |
    Promise<ADResponse<T>> |
    void |
    Promise<void>
export default interface ADHttpInterceptor<Base = any> {
    enabled?: boolean
    name?: string

    intercept<T>(chain: Chain<Base & T>): ADHttpInterceptorInterceptReturn<Base & T>
}