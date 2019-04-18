import ADRest from './ADRest';
import ADFetchClient from './ADFetchClient';

export {default as ADRequest}from './ADRequest';

export {
    default as ADResponse
}from './ADResponse';

export {
    default as ADFetchClient
}from './ADFetchClient';

export {
    default as Rest,
    default as ADRest
}from './ADRest';

export {
    default as Client,
    default as ADClient,
}from './ADClient';

export {
    default as Chain,
    default as ADChain
}from './ADChain';

export {
    default as HttpError,
    default as ADHttpError
}from './error/ADHttpError';

export {
    default as StatusError,
    default as ADStatusError
}from './error/ADStatusError';

export {
    default as HttpInterceptor,
    default as ADHttpInterceptor
}from './interceptors/ADHttpInterceptor';

export {
    default as BaseHttpInterceptor,
    default as ADBaseHttpInterceptor
}from './interceptors/ADBaseHttpInterceptor';

export {
    default as PrepareRequestInterceptor,
    default as ADPrepareRequestInterceptor
}from './interceptors/ADPrepareRequestInterceptor';

export {
    default as StatusCheckerHttpInterceptor,
    default as ADStatusCheckerHttpInterceptor
}from './interceptors/ADStatusCheckerHttpInterceptor';

export {
    default as BaseUrlHttpInterceptor,
    default as ADBaseUrlHttpInterceptor
}from './interceptors/ADBaseUrlHttpInterceptor';

//@ts-ignore
const gl = global || window || {};
const ADHttp: ADRest<Response> = gl['ad-http-default-rest'] || new ADRest<Response>(new ADFetchClient());
export default ADHttp;