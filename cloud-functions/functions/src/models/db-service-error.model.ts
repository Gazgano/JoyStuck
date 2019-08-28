export class DbServiceError {
    public code: number;
    public message: string;
    public err: any;

    constructor(err?: any, message?: string, code?: number) {
        this.err = err;
        this.message = message || 'Error fetching data';
        this.code = code || 500;

        console.error(`Error code ${this.code} - ${this.message}`, JSON.stringify(this.err));
    }
}