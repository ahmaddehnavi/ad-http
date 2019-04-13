import Chain from '../ADChain';
import ADHttpInterceptor, {ADHttpInterceptorInterceptReturn} from "./ADHttpInterceptor";


export default class ADBaseHttpInterceptor<Options>
    implements ADHttpInterceptor {
    protected options: Options;

    constructor(options: Options) {
        this.options = options
    }

    intercept<T>(chain: Chain<T>): ADHttpInterceptorInterceptReturn<T> {
        return chain.proceed();
    }
}