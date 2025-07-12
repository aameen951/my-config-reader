import fs from 'fs';

type ReadRes<T> = {ok: true; value: T} | {ok: false};

type Validator<T> = (key: string, v: T) => void;

function str_validator<T>(key: string, v: T): void {
  if(typeof v !== 'string') throw new Error(`Error: the value of '${key}' is not a string (got: ${typeof v})`);
}
function num_validator<T>(key: string, v: T): void {
  if(typeof v !== 'number') throw new Error(`Error: the value of '${key}' is not a number (got: ${typeof v})`);
}
function bool_validator<T>(key: string, v: T): void {
  if(typeof v !== 'boolean') throw new Error(`Error: the value of '${key}' is not a boolean (got: ${typeof v})`);
}

export class ConfigReader {

  public path = "";
  private data = new Map<string, any>();

  private constructor() {}

  private _from_stringified_json(data: string){
    try {
      data = JSON.parse(data);
    } catch(e: any) {
      throw new Error(`Error: failed to parse config file '${this.path}' (details: ${e.message})`);
    }

    if(typeof data !== 'object') {
      throw new Error(`Error: root is not an object for config file '${this.path}' (got: ${typeof data})`);
    }
    if(data === null) {
      throw new Error(`Error: root is not an object for config file '${this.path}' (got: null)`);
    }
    if(Array.isArray(data)) {
      throw new Error(`Error: root is not an object for config file '${this.path}' (got: array)`);
    }

    for(let [key, value] of Object.entries<any>(data)) {
      this.data.set(key, value);
    }
  }

  static from_file_path(path: string){
    const config = new ConfigReader();
    config.path = path;
    let data: any = null;
    try {
      data = fs.readFileSync(config.path, {encoding: 'utf-8'});
    } catch(e: any) {
      throw new Error(`Error: failed to load config file '${config.path}' (details: ${e.message})`);
    }
    config._from_stringified_json(data);
    return config;
  }
  static from_stringified_json(data: string){
    const config = new ConfigReader();
    config.path = "<string-input>";
    config._from_stringified_json(data);
    return config;
  }


  read<T>(key: string, allow_null: boolean, validate?: Validator<T>): ReadRes<T> {
    if(this.data.has(key)) {
      let value = this.data.get(key)!;
      if(value === null) {
        if(!allow_null) {
          throw new Error(`Error: the value of '${key}' is not allowed to be null`);
        }
      } else if(validate) {
        validate(key, value);
      }
      return {ok: true, value};
    } else {
      return {ok: false};
    }
  }
  read_or<T, V>(key: string, allow_null: boolean, default_value: V, validate?: Validator<T>){
    let res = this.read(key, allow_null, validate);
    if(!res.ok)return default_value;
    return res.value;
  }
  read_or_throw<T>(key: string, allow_null: boolean, validate?: Validator<T>): T {
    let res = this.read<T>(key, allow_null, validate);
    if(!res.ok)throw new Error(`Error: config value wasn't found for '${key}' in '${this.path}'`);
    return res.value;
  }

  read_str(key: string, allow_null: boolean) {return this.read<string>(key, allow_null, str_validator);}
  read_str_or<T>(key: string, allow_null: boolean, default_value: T) {return this.read_or<string, T>(key, allow_null, default_value, str_validator);}
  read_str_or_throw(key: string, allow_null: boolean) {return this.read_or_throw<string>(key, allow_null, str_validator);}

  read_num(key: string, allow_null: boolean) {return this.read<number>(key, allow_null, num_validator);}
  read_num_or<T>(key: string, allow_null: boolean, default_value: T) {return this.read_or<number, T>(key, allow_null, default_value, num_validator);}
  read_num_or_throw(key: string, allow_null: boolean) {return this.read_or_throw<number>(key, allow_null, num_validator);}

  read_bool(key: string, allow_null: boolean) {return this.read<boolean>(key, allow_null, bool_validator);}
  read_bool_or<T>(key: string, allow_null: boolean, default_value: T) {return this.read_or<boolean, T>(key, allow_null, default_value, bool_validator);}
  read_bool_or_throw(key: string, allow_null: boolean) {return this.read_or_throw<boolean>(key, allow_null, bool_validator);}

}
