import ADHttpError from "./ADHttpError";

describe('ADHttpError Test', () => {

    it('should be instance of Error', () => {
        let error = new ADHttpError();
        expect(error).toBeInstanceOf(Error);
    });

    it('should error name be ADHttpError', () => {
        let error = new ADHttpError();
        expect(error.name).toBe('ADHttpError');
    });

    it('should message be same', () => {
        let error = new ADHttpError('test message');
        expect(error.message).toBe('test message');
    });
});
