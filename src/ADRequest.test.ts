import ADRequest from "./ADRequest";

describe('ADRequest Test', () => {
    it('should request be immutable', () => {
        let req1 = new ADRequest.Builder()
            .params({
                test: 'value1'
            })
            .build();

        req1.edit()
            .params({
                test: 'value2'
            })
            .build();

        expect(req1.params.test).toBe('value1');
    });

    it('should params set correctly', () => {
        let req = new ADRequest.Builder()
            .params({
                test: 'value'
            })
            .build();

        expect(req.params.test).toBe('value');
    });

    it('should data set correctly', () => {
        let req = new ADRequest.Builder()
            .data({
                test: 'value'
            })
            .build();

        expect(req.data.test).toBe('value');
    });

    it('should files set correctly', () => {
        let req = new ADRequest.Builder()
            .files({
                test: {
                    name: 'name',
                    type: 'type',
                    uri: 'uri'
                }
            })
            .build();

        expect(req.files.test && req.files.test['name']).toBe('name');
    });
});