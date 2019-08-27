export class DbServiceData<T> {
    public code: number;
    public data: T;

    constructor(data: T, code?: number) {
        this.data = data;
        this.code = code || 200;
    }
}