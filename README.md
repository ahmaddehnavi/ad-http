#ad-http
[![Build Status](https://travis-ci.com/ahmaddehnavi/ad-http.svg?branch=master)](https://travis-ci.com/ahmaddehnavi/ad-http)

#Install :
```
yarn add ad-http
```

#Simple Usage
```typescript
import ADHttp, {Request} from 'ad-http'

 ADHttp.process('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.body())
        .then(body => body.json())
        .then(json => {
            console.log(json)
        })
        .catch(error=>{
            console.error(error)
        })
```
#Advanced Usage
**import**
```typescript
import {
    PrepareRequestInterceptor,
    StatusCheckerHttpInterceptor,
    BaseUrlHttpInterceptor,
    HttpError,
    StatusError,
    Rest,
    Request,
    NormalClient
} from 'ad-http'
```
**create rest instance**
```
type BaseResponse = { status: boolean, message: string }
let rest = new Rest<BaseResponse>();
```
***or use custom client***
```
type BaseResponse = { status: boolean, message: string }
let rest = new Rest<BaseResponse>(new NormalClient());
```

**change request or response if need**
```
rest.interceptors.push(new PrepareRequestInterceptor());
rest.interceptors.push(new StatusCheckerHttpInterceptor());
rest.interceptors.push(new BaseUrlHttpInterceptor('https://httpstat.us/'));
```
**write custom interceptors**
```
// make new request
rest.interceptors.push({
    name: 'MakeNewRequest',
    intercept: async (chain) => {
        console.log('check status to make new request ' + chain.request.url);
        let response = await chain.proceed();
        if (response.status === 404) {
            let url = 'https://jsonplaceholder.typicode.com/todos';
            console.log('try make new request to' + url);
            return (
                chain.reset()
                    .proceed(
                        chain.request
                            .edit()
                            .url(url)
                            .build()
                    )
            );
        }
        return response;
    }
});
```

**create request**
```
let request = new Request.Builder()
        .url('/404')
        .build();
```

**process request**
```
rest.process(request)
    .then(async (response) => {
       console.log('Status : ',response.status);
       console.log('Headers : ',response.headers);
       let body=await response.body();
       let model=await body.json();
       console.log(model);
    })
    .catch((e) => {
       console.error(e);
       console.error(e instanceof StatusError);
       console.error(e instanceof HttpError);
       console.error(e instanceof Error);
    });
```