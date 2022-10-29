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
    constructor(path) {
        this.data = new Map();
        this.path = path;
        let data = null;
        try {
            data = fs_1.default.readFileSync(this.path, { encoding: 'utf-8' });
        }
        catch (e) {
            throw new Error(`Error: failed to load config file '${this.path}' (details: ${e.message})`);
        }
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
    read(key, validate) {
        if (this.data.has(key)) {
            let value = this.data.get(key);
            if (validate)
                validate(key, value);
            return { ok: true, value };
        }
        else {
            return { ok: false };
        }
    }
    read_or(key, default_value, validate) {
        let res = this.read(key, validate);
        if (!res.ok)
            return default_value;
        return res.value;
    }
    read_or_throw(key, validate) {
        let res = this.read(key, validate);
        if (!res.ok)
            throw new Error(`Error: config value wasn't found for '${key}' in '${this.path}'`);
        return res.value;
    }
    read_str(key) { return this.read(key, str_validator); }
    read_str_or(key, default_value) { return this.read_or(key, default_value, str_validator); }
    read_str_or_throw(key) { return this.read_or_throw(key, str_validator); }
    read_num(key) { return this.read(key, num_validator); }
    read_num_or(key, default_value) { return this.read_or(key, default_value, num_validator); }
    read_num_or_throw(key) { return this.read_or_throw(key, num_validator); }
    read_bool(key) { return this.read(key, bool_validator); }
    read_bool_or(key, default_value) { return this.read_or(key, default_value, bool_validator); }
    read_bool_or_throw(key) { return this.read_or_throw(key, bool_validator); }
}
exports.ConfigReader = ConfigReader;
//# sourceMappingURL=index.js.map