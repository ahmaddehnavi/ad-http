import ADBaseError from "./ADBaseError";

describe('ADBaseError Test', () => {

    it('should be instance of Error', () => {
        let error = new ADBaseError();
        expect(error).toBeInstanceOf(Error);
    });

    it('should error name be ADBaseError', () => {
        let error = new ADBaseError();
        expect(error.name).toBe('ADBaseError');
    });

    it('should message be same', () => {
        let error = new ADBaseError('test message');
        expect(error.message).toBe('test message');
    });
});
