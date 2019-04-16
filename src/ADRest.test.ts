import ADRest from "./ADRest";
import ADResponse from "./ADResponse";
import ADRequest from "./ADRequest";

describe('ADRest Test', () => {
    it('should ', async () => {
        let body = JSON.stringify({
            'test': 'test-value'
        });
        let rest = new ADRest({
            async fetch<T>(request: Readonly<ADRequest>): Promise<ADResponse<T>> {
                return new ADResponse({
                    body: body,
                    headers: {},
                    status: 200,
                    statusText: 'text'
                })
            }
        });

        let req = new ADRequest.Builder().url('url').build();
        let res = await rest.process(req);
        expect(await res.text()).toBe(body);
        expect((await res.json())['test']).toBe(JSON.parse(body)['test'])
    });
});