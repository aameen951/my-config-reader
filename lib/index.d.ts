type ReadRes<T> = {
    ok: true;
    value: T;
} | {
    ok: false;
};
type Validator<T> = (key: string, v: T) => void;
export declare class ConfigReader {
    path: string;
    private data;
    private constructor();
    private _from_stringified_json;
    static from_file_path(path: string): ConfigReader;
    static from_stringified_json(data: string): ConfigReader;
    read<T>(key: string, allow_null: boolean, validate?: Validator<T>): ReadRes<T>;
    read_or<T, V>(key: string, allow_null: boolean, default_value: V, validate?: Validator<T>): T | V;
    read_or_throw<T>(key: string, allow_null: boolean, validate?: Validator<T>): T;
    read_str(key: string, allow_null: boolean): ReadRes<string>;
    read_str_or<T>(key: string, allow_null: boolean, default_value: T): string | T;
    read_str_or_throw(key: string, allow_null: boolean): string;
    read_num(key: string, allow_null: boolean): ReadRes<number>;
    read_num_or<T>(key: string, allow_null: boolean, default_value: T): number | T;
    read_num_or_throw(key: string, allow_null: boolean): number;
    read_bool(key: string, allow_null: boolean): ReadRes<boolean>;
    read_bool_or<T>(key: string, allow_null: boolean, default_value: T): boolean | T;
    read_bool_or_throw(key: string, allow_null: boolean): boolean;
}
export {};
//# sourceMappingURL=index.d.ts.map