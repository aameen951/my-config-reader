"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigReader = void 0;
const fs_1 = __importDefault(require("fs"));
function str_validator(key, v) {
    if (typeof v !== 'string')
        throw new Error(`Error: the value of '${key}' is not a string (got: ${typeof v})`);
}
function num_validator(key, v) {
    if (typeof v !== 'number')
        throw new Error(`Error: the value of '${key}' is not a number (got: ${typeof v})`);
}
function bool_validator(key, v) {
    if (typeof v !== 'boolean')
        throw new Error(`Error: the value of '${key}' is not a boolean (got: ${typeof v})`);
}
class ConfigReader {
    constructor() {
        this.path = "";
        this.data = new Map();
    }
    _from_stringified_json(data) {
        try {
            data = JSON.parse(data);
        }
        catch (e) {
            throw new Error(`Error: failed to parse config file '${this.path}' (details: ${e.message})`);
        }
        if (typeof data !== 'object') {
            throw new Error(`Error: root is not an object for config file '${this.path}' (got: ${typeof data})`);
        }
        if (data === null) {
            throw new Error(`Error: root is not an object for config file '${this.path}' (got: null)`);
        }
        if (Array.isArray(data)) {
            throw new Error(`Error: root is not an object for config file '${this.path}' (got: array)`);
        }
        for (let [key, value] of Object.entries(data)) {
            this.data.set(key, value);
        }
    }
    static from_file_path(path) {
        const config = new ConfigReader();
        config.path = path;
        let data = null;
        try {
            data = fs_1.default.readFileSync(config.path, { encoding: 'utf-8' });
        }
        catch (e) {
            throw new Error(`Error: failed to load config file '${config.path}' (details: ${e.message})`);
        }
        config._from_stringified_json(data);
        return config;
    }
    static from_stringified_json(data) {
        const config = new ConfigReader();
        config.path = "<string-input>";
        config._from_stringified_json(data);
        return config;
    }
    read(key, allow_null, validate) {
        if (this.data.has(key)) {
            let value = this.data.get(key);
            if (value === null) {
                if (!allow_null) {
                    throw new Error(`Error: the value of '${key}' is not allowed to be null`);
                }
            }
            else if (validate) {
                validate(key, value);
            }
            return { ok: true, value };
        }
        else {
            return { ok: false };
        }
    }
    read_or(key, allow_null, default_value, validate) {
        let res = this.read(key, allow_null, validate);
        if (!res.ok)
            return default_value;
        return res.value;
    }
    read_or_throw(key, allow_null, validate) {
        let res = this.read(key, allow_null, validate);
        if (!res.ok)
            throw new Error(`Error: config value wasn't found for '${key}' in '${this.path}'`);
        return res.value;
    }
    read_str(key, allow_null) { return this.read(key, allow_null, str_validator); }
    read_str_or(key, allow_null, default_value) { return this.read_or(key, allow_null, default_value, str_validator); }
    read_str_or_throw(key, allow_null) { return this.read_or_throw(key, allow_null, str_validator); }
    read_num(key, allow_null) { return this.read(key, allow_null, num_validator); }
    read_num_or(key, allow_null, default_value) { return this.read_or(key, allow_null, default_value, num_validator); }
    read_num_or_throw(key, allow_null) { return this.read_or_throw(key, allow_null, num_validator); }
    read_bool(key, allow_null) { return this.read(key, allow_null, bool_validator); }
    read_bool_or(key, allow_null, default_value) { return this.read_or(key, allow_null, default_value, bool_validator); }
    read_bool_or_throw(key, allow_null) { return this.read_or_throw(key, allow_null, bool_validator); }
}
exports.ConfigReader = ConfigReader;
//# sourceMappingURL=index.js.map