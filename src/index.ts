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

  public path: string;
  private data = new Map<string, any>();

  constructor(path: string) {
    this.path = path;
    let data: any = null;
    try {
      data = fs.readFileSync(this.path, {encoding: 'utf-8'});
    } catch(e: any) {
      throw new Error(`Error: failed to load config file '${this.path}' (details: ${e.message})`);
    }

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

  read<T>(key: string, validate?: Validator<T>): ReadRes<T> {
    if(this.data.has(key)) {
      let value = this.data.get(key)!;
      if(validate)validate(key, value);
      return {ok: true, value};
    } else {
      return {ok: false};
    }
  }
  read_or<T, V>(key: string, default_value: V, validate?: Validator<T>){
    let res = this.read(key, validate);
    if(!res.ok)return default_value;
    return res.value;
  }
  read_or_throw<T>(key: string, validate?: Validator<T>): T {
    let res = this.read<T>(key, validate);
    if(!res.ok)throw new Error(`Error: config value wasn't found for '${key}' in '${this.path}'`);
    return res.value;
  }

  read_str(key: string) {return this.read<string>(key, str_validator);}
  read_str_or<T>(key: string, default_value: T) {return this.read_or<string, T>(key, default_value, str_validator);}
  read_str_or_throw(key: string) {return this.read_or_throw<string>(key, str_validator);}

  read_num(key: string) {return this.read<number>(key, num_validator);}
  read_num_or<T>(key: string, default_value: T) {return this.read_or<number, T>(key, default_value, num_validator);}
  read_num_or_throw(key: string) {return this.read_or_throw<number>(key, num_validator);}

  read_bool(key: string) {return this.read<boolean>(key, bool_validator);}
  read_bool_or<T>(key: string, default_value: T) {return this.read_or<boolean, T>(key, default_value, bool_validator);}
  read_bool_or_throw(key: string) {return this.read_or_throw<boolean>(key, bool_validator);}

}
