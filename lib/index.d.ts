declare type ReadRes<T> = {
    ok: true;
    value: T;
} | {
    ok: false;
};
declare type Validator<T> = (key: string, v: T) => void;
export declare class ConfigReader {
    path: string;
    private data;
    constructor(path: string);
    read<T>(key: string, validate?: Validator<T>): ReadRes<T>;
    read_or<T, V>(key: string, default_value: V, validate?: Validator<T>): T | V;
    read_or_throw<T>(key: string, validate?: Validator<T>): T;
    read_str(key: string): ReadRes<string>;
    read_str_or<T>(key: string, default_value: T): string | T;
    read_str_or_throw(key: string): string;
    read_num(key: string): ReadRes<number>;
    read_num_or<T>(key: string, default_value: T): number | T;
    read_num_or_throw(key: string): number;
    read_bool(key: string): ReadRes<boolean>;
    read_bool_or<T>(key: string, default_value: T): boolean | T;
    read_bool_or_throw(key: string): boolean;
}
export {};
//# sourceMappingURL=index.d.ts.map