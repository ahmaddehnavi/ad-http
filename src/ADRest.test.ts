import ADRest from "./ADRest";
import ADResponse from "./ADResponse";
import ADRequest from "./ADRequest";

describe('ADRest Test', () => {
    let body = JSON.stringify({
        'test': 'test-value'
    });
    let res: ADResponse<any>;
    beforeEach(async () => {
        let rest = new ADRest({
            async fetch<T>(request: Readonly<ADRequest>): Promise<ADResponse<T>> {
                return new ADResponse({
                    body: body,
                    headers: {'test': 'test header'},
                    status: 200,
                    statusText: 'text'
                })
            }
        });

        let req = new ADRequest.Builder().url('url').build();
        res = await rest.process(req);
    });

    it('should response.text() work correctly', async () => {
        expect(await res.text()).toBe(body);
    });

    it('should response.json() work correctly', async () => {
        expect((await res.json())['test']).toBe(JSON.parse(body)['test'])
    });

    it('should response.status work correctly', async () => {
        expect(await res.status).toBe(200)
    });
    it('should response.headers work correctly', async () => {
        expect(await res.headers['test']).toBe('test header')
    });

    it('should response.statusText work correctly', async () => {
        expect(await res.statusText).toBe('text')
    });
});