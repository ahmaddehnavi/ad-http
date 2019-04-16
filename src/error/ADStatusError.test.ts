import ADStatusError from "./ADStatusError";
import ADHttpError from "./ADHttpError";

describe('ADStatusError Test', () => {

    it('should be instance of Error', () => {
        let error = new ADStatusError();
        expect(error).toBeInstanceOf(Error);
    });

    it('should be instance of ADHttpError', () => {
        let error = new ADStatusError();
        expect(error).toBeInstanceOf(ADHttpError);
    });

    it('should error name be ADStatusError', () => {
        let error = new ADStatusError();
        expect(error.name).toBe('ADStatusError');
    });
});
