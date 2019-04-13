export default class ADBaseError extends Error {
    message: string;
    stack?: any;
    name: string;

    constructor(message?: string) {
        super(message);
        let e = new Error(message);
        this.message = e.message;
        this.stack = e.stack;
        this.name = this.constructor.name;
    }
}
ADBaseError.prototype = Error.prototype;