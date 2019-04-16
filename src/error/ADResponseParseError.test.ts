import ADResponseParseError from "./ADResponseParseError";
import ADHttpError from "./ADHttpError";

describe('ADResponseParseError Test', () => {

    it('should be instance of Error', () => {
        let error = new ADResponseParseError();
        expect(error).toBeInstanceOf(Error);
    });

    it('should be instance of ADHttpError', () => {
        let error = new ADResponseParseError();
        expect(error).toBeInstanceOf(ADHttpError);
    });

    it('should error name be ADResponseParseError', () => {
        let error = new ADResponseParseError();
        expect(error.name).toBe('ADResponseParseError');
    });

    it('should message be same', () => {
        let error = new ADResponseParseError('test message');
        expect(error.message).toBe('test message');
    });
});
