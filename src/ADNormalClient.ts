import autobind from 'autobind-decorator';
import ADClient from './ADClient';
import ADResponse from './ADResponse';
import ADLogger from 'ad-logger'
import ADRequest from "./ADRequest";

let customFetch;
try {
    // @ts-ignore
    if (!global.fetch) {
        // @ts-ignore
        customFetch = require('node-fetch');
    }
    // @ts-ignore
    if (!global.FormData) {
        // @ts-ignore
        var FormData = require('form-data');
    }
} catch (e) {
}

type  Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

@autobind
export default class NormalClient implements ADClient {
    // @ts-ignore
    customFetch: Fetch = global.fetch || customFetch;

    async fetch<T>(req: ADRequest): Promise<ADResponse<T>> {

        let method = req.method.toLowerCase();
        let body: any;
        let dataAndFiles = {...req.data, ...req.files};
        if (method !== 'get') {
            body = new FormData();
            let keys = Object.keys(dataAndFiles);
            keys.forEach(key => {
                body.append(key, dataAndFiles[key]);
            });

            // to fix react native bug when post empty body
            if (keys.length === 0) {
                body.append('____________', '__________')
            }
        }

        let endpoint = req.url;

        let paramNames = Object.keys(req.params || {});
        if (paramNames) {

            let queryString = paramNames.map(key => {
                return (
                    encodeURIComponent(key) +
                    '=' +
                    encodeURIComponent(String(req.params[key]))
                )
            }).join('&');

            if (queryString && !endpoint.includes('?')) {
                endpoint += '?'
            }

            endpoint += queryString;
        }

        ADLogger.debug(`${req.method} ${endpoint}`);
        let response = await this.customFetch(endpoint, {
            method: req.method,
            body: body,
            headers: req.headers as any
        });

        let headers: { [key: string]: any } = Object.create(null);
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });

        return new ADResponse({
            body: response,
            statusText: response.statusText,
            status: response.status,
            headers: headers
        })
    }
}
