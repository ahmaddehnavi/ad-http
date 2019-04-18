import ADRest from "./ADRest";
import ADResponse from "./ADResponse";
import ADRequest from "./ADRequest";

describe('ADRest Test', () => {
    let rest: ADRest<ADRequest>;
    beforeEach(async () => {
        rest = new ADRest<ADRequest>(async (r) => {
            return new ADResponse({
                body: r,
                headers: {'test': 'test header'},
                status: 200,
                statusText: 'text'
            })
        });

    });

    it('should response.body() work correctly', async () => {
        let req = new ADRequest.Builder().url('url').build();
        let res = await rest.process(req);

        expect((await res.body()).url).toBe(req.url);
    });

    it('should response.status work correctly', async () => {
        let req = ADRequest.post('');
        let res = await rest.process(req);
        expect(await res.status).toBe(200)
    });

    it('should response.headers work correctly', async () => {
        let req = ADRequest.post('');
        let res = await rest.process(req);
        expect(await res.headers['test']).toBe('test header')
    });

    it('should response.statusText work correctly', async () => {
        let req = ADRequest.post('');
        let res = await rest.process(req);
        expect(await res.statusText).toBe('text')
    });
});