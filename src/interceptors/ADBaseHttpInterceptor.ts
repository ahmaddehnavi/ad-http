import Chain from '../ADChain';
import ADHttpInterceptor, {ADHttpInterceptorInterceptReturn} from "./ADHttpInterceptor";


export default abstract class ADBaseHttpInterceptor<Options,
    ResponseBodyType = any,
    RequestConfigType = never>
    implements ADHttpInterceptor<ResponseBodyType, RequestConfigType> {
    protected options: Options;

    protected constructor(options: Options) {
        this.options = options
    }

    abstract intercept(chain: Chain<ResponseBodyType, RequestConfigType>): ADHttpInterceptorInterceptReturn<ResponseBodyType>;
}