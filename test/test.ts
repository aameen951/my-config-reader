import assert from 'assert';
import test from 'node:test';
import path from 'path';
import fs from 'fs';
import { ConfigReader } from '..';

function throws_start_with(fn: any, starts_with: string){
  assert.throws(() => {
    fn();
  }, (e: Error) => {return e.message.startsWith(starts_with)});
}

test("File reading", (t) => {
  throws_start_with(() => {
    ConfigReader.from_file_path(path.join(__dirname, 'data/non-existent.json'));
  }, "Error: failed to load config file");
});

test("JSON", (t) => {
  throws_start_with(() => {
    ConfigReader.from_file_path(path.join(__dirname, 'data/bad-json.json'));
  }, "Error: failed to parse config file");

  throws_start_with(() => {
    ConfigReader.from_stringified_json(fs.readFileSync(path.join(__dirname, 'data/bad-json.json'), 'utf-8'));
  }, "Error: failed to parse config file");

});

test("File format", (t) => {

  throws_start_with(() => {
    ConfigReader.from_file_path(path.join(__dirname, 'data/bad-format-null.json'));
  }, "Error: root is not an object for config file");
  throws_start_with(() => {
    ConfigReader.from_file_path(path.join(__dirname, 'data/bad-format-string.json'));
  }, "Error: root is not an object for config file");
  throws_start_with(() => {
    ConfigReader.from_file_path(path.join(__dirname, 'data/bad-format-number.json'));
  }, "Error: root is not an object for config file");
  throws_start_with(() => {
    ConfigReader.from_file_path(path.join(__dirname, 'data/bad-format-boolean.json'));
  }, "Error: root is not an object for config file");
  throws_start_with(() => {
    ConfigReader.from_file_path(path.join(__dirname, 'data/bad-format-array.json'));
  }, "Error: root is not an object for config file");

});

test("Read non-existent", (t) => {

  let reader = ConfigReader.from_file_path(path.join(__dirname, 'data/valid.json'));

  assert.deepStrictEqual(reader.read('non-existent', false), {ok: false});
  assert.deepStrictEqual(reader.read_num('non-existent', false), {ok: false});

  assert.deepStrictEqual(reader.read_or('non-existent', false, 1), 1);
  assert.deepStrictEqual(reader.read_num_or('non-existent', false, 3), 3);

  throws_start_with(() => {
    reader.read_or_throw('non-existent', false);
  }, "Error: config value wasn't found for");
  throws_start_with(() => {
    reader.read_num_or_throw('non-existent', false);
  }, "Error: config value wasn't found for");

});

test("Read value", (t) => {

  let reader = ConfigReader.from_file_path(path.join(__dirname, 'data/valid.json'));

  assert.deepStrictEqual(reader.read('any_val', false), {ok: true, value: 1});

  assert.deepStrictEqual(reader.read_or('any_val', false, 2), 1);

  assert.deepStrictEqual(reader.read_or_throw('any_val', false), 1);

});

test("Read number-typed values", (t) => {

  let reader = ConfigReader.from_file_path(path.join(__dirname, 'data/valid.json'));

  assert.deepStrictEqual(reader.read_num('num_val', false), {ok: true, value: 2});
  assert.deepStrictEqual(reader.read_num_or('num_val', false, 3), 2);
  assert.deepStrictEqual(reader.read_num_or_throw('num_val', false), 2);

  throws_start_with(() => {
    reader.read_num('bool_val', false);
  }, "Error: the value of 'bool_val' is not a number");
  throws_start_with(() => {
    reader.read_num_or('bool_val', false, 'any2');
  }, "Error: the value of 'bool_val' is not a number");
  throws_start_with(() => {
    reader.read_num_or_throw('bool_val', false);
  }, "Error: the value of 'bool_val' is not a number");

  throws_start_with(() => {
    reader.read_num('str_val', false);
  }, "Error: the value of 'str_val' is not a number");
  throws_start_with(() => {
    reader.read_num_or('str_val', false, 'any2');
  }, "Error: the value of 'str_val' is not a number");
  throws_start_with(() => {
    reader.read_num_or_throw('str_val', false);
  }, "Error: the value of 'str_val' is not a number");
  
  throws_start_with(() => {
    reader.read_num('null_val', false);
  }, "Error: the value of 'null_val' is not allowed to be null");
  throws_start_with(() => {
    reader.read_num_or('null_val', false, 'any2');
  }, "Error: the value of 'null_val' is not allowed to be null");
  throws_start_with(() => {
    reader.read_num_or_throw('null_val', false);
  }, "Error: the value of 'null_val' is not allowed to be null");

});

test("Read string-typed values", (t) => {

  let reader = ConfigReader.from_file_path(path.join(__dirname, 'data/valid.json'));

  assert.deepStrictEqual(reader.read_str('str_val', false), {ok: true, value: 'a'});
  assert.deepStrictEqual(reader.read_str_or('str_val', false, 3), 'a');
  assert.deepStrictEqual(reader.read_str_or_throw('str_val', false), 'a');

  throws_start_with(() => {
    reader.read_str('bool_val', false);
  }, "Error: the value of 'bool_val' is not a string");
  throws_start_with(() => {
    reader.read_str_or('bool_val', false, 'any2');
  }, "Error: the value of 'bool_val' is not a string");
  throws_start_with(() => {
    reader.read_str_or_throw('bool_val', false);
  }, "Error: the value of 'bool_val' is not a string");

  throws_start_with(() => {
    reader.read_str('num_val', false);
  }, "Error: the value of 'num_val' is not a string");
  throws_start_with(() => {
    reader.read_str_or('num_val', false, 'any2');
  }, "Error: the value of 'num_val' is not a string");
  throws_start_with(() => {
    reader.read_str_or_throw('num_val', false);
  }, "Error: the value of 'num_val' is not a string");
  
  throws_start_with(() => {
    reader.read_str('null_val', false);
  }, "Error: the value of 'null_val' is not allowed to be null");
  throws_start_with(() => {
    reader.read_str_or('null_val', false, 'any2');
  }, "Error: the value of 'null_val' is not allowed to be null");
  throws_start_with(() => {
    reader.read_str_or_throw('null_val', false);
  }, "Error: the value of 'null_val' is not allowed to be null");

});

test("Read bool-typed values", (t) => {

  let reader = ConfigReader.from_file_path(path.join(__dirname, 'data/valid.json'));

  assert.deepStrictEqual(reader.read_bool('bool_val', false), {ok: true, value: true});
  assert.deepStrictEqual(reader.read_bool_or('bool_val', false, 3), true);
  assert.deepStrictEqual(reader.read_bool_or_throw('bool_val', false), true);

  throws_start_with(() => {
    reader.read_bool('str_val', false);
  }, "Error: the value of 'str_val' is not a boolean");
  throws_start_with(() => {
    reader.read_bool_or('str_val', false, 'any2');
  }, "Error: the value of 'str_val' is not a boolean");
  throws_start_with(() => {
    reader.read_bool_or_throw('str_val', false);
  }, "Error: the value of 'str_val' is not a boolean");

  throws_start_with(() => {
    reader.read_bool('num_val', false);
  }, "Error: the value of 'num_val' is not a boolean");
  throws_start_with(() => {
    reader.read_bool_or('num_val', false, 'any2');
  }, "Error: the value of 'num_val' is not a boolean");
  throws_start_with(() => {
    reader.read_bool_or_throw('num_val', false);
  }, "Error: the value of 'num_val' is not a boolean");
  
  throws_start_with(() => {
    reader.read_bool('null_val', false);
  }, "Error: the value of 'null_val' is not allowed to be null");
  throws_start_with(() => {
    reader.read_bool_or('null_val', false, 'any2');
  }, "Error: the value of 'null_val' is not allowed to be null");
  throws_start_with(() => {
    reader.read_bool_or_throw('null_val', false);
  }, "Error: the value of 'null_val' is not allowed to be null");

});

