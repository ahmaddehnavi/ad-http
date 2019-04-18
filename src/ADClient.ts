import ADResponse, {IADResponse} from './ADResponse';
import ADRequest from './ADRequest';

export type ADClientResponseType<ResponseBodyType> = Promise<IADResponse<ResponseBodyType>>

export interface ADClientClass<ResponseBodyType, RequestConfigType> {
    fetch(request: ADRequest<RequestConfigType>): ADClientResponseType<ResponseBodyType>
}

export type  ADClientFunction<ResponseBodyType, RequestConfigType> =
    ((req: ADRequest<RequestConfigType>) => ADClientResponseType<ResponseBodyType>)

export type ADClient<ResponseBodyType, RequestConfigType> = ADClientFunction<ResponseBodyType, RequestConfigType> |
    ADClientClass<ResponseBodyType, RequestConfigType>