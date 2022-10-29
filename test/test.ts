import assert from 'assert';
import test from 'node:test';
import path from 'path';
import { ConfigReader } from '..';

function throws_start_with(fn: any, starts_with: string){
  assert.throws(() => {
    fn();
  }, (e: Error) => {return e.message.startsWith(starts_with)});
}

test("File reading", (t) => {
  throws_start_with(() => {
    new ConfigReader(path.join(__dirname, 'data/non-existent.json'));
  }, "Error: failed to load config file");
});

test("JSON", (t) => {
  throws_start_with(() => {
    new ConfigReader(path.join(__dirname, 'data/bad-json.json'));
  }, "Error: failed to parse config file");
});

test("File format", (t) => {

  throws_start_with(() => {
    new ConfigReader(path.join(__dirname, 'data/bad-format-null.json'));
  }, "Error: root is not an object for config file");
  throws_start_with(() => {
    new ConfigReader(path.join(__dirname, 'data/bad-format-string.json'));
  }, "Error: root is not an object for config file");
  throws_start_with(() => {
    new ConfigReader(path.join(__dirname, 'data/bad-format-number.json'));
  }, "Error: root is not an object for config file");
  throws_start_with(() => {
    new ConfigReader(path.join(__dirname, 'data/bad-format-boolean.json'));
  }, "Error: root is not an object for config file");
  throws_start_with(() => {
    new ConfigReader(path.join(__dirname, 'data/bad-format-array.json'));
  }, "Error: root is not an object for config file");

});

test("Read non-existent", (t) => {

  let reader = new ConfigReader(path.join(__dirname, 'data/valid.json'));

  assert.deepStrictEqual(reader.read('non-existent'), {ok: false});
  assert.deepStrictEqual(reader.read_num('non-existent'), {ok: false});

  assert.deepStrictEqual(reader.read_or('non-existent', 1), 1);
  assert.deepStrictEqual(reader.read_num_or('non-existent', 3), 3);

  throws_start_with(() => {
    reader.read_or_throw('non-existent');
  }, "Error: config value wasn't found for");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_num_or_throw('non-existent'), "any");
  }, "Error: config value wasn't found for");

});

test("Read value", (t) => {

  let reader = new ConfigReader(path.join(__dirname, 'data/valid.json'));

  assert.deepStrictEqual(reader.read('any_val'), {ok: true, value: 1});

  assert.deepStrictEqual(reader.read_or('any_val', 2), 1);

  assert.deepStrictEqual(reader.read_or_throw('any_val'), 1);

});

test("Read number-typed values", (t) => {

  let reader = new ConfigReader(path.join(__dirname, 'data/valid.json'));

  assert.deepStrictEqual(reader.read_num('num_val'), {ok: true, value: 2});
  assert.deepStrictEqual(reader.read_num_or('num_val', 3), 2);
  assert.deepStrictEqual(reader.read_num_or_throw('num_val'), 2);

  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_num('bool_val'), "any");
  }, "Error: the value of 'bool_val' is not a number");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_num_or('bool_val', 'any2'), "any");
  }, "Error: the value of 'bool_val' is not a number");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_num_or_throw('bool_val'), "any");
  }, "Error: the value of 'bool_val' is not a number");

  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_num('str_val'), "any");
  }, "Error: the value of 'str_val' is not a number");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_num_or('str_val', 'any2'), "any");
  }, "Error: the value of 'str_val' is not a number");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_num_or_throw('str_val'), "any");
  }, "Error: the value of 'str_val' is not a number");
  
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_num('null_val'), "any");
  }, "Error: the value of 'null_val' is not a number");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_num_or('null_val', 'any2'), "any");
  }, "Error: the value of 'null_val' is not a number");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_num_or_throw('null_val'), "any");
  }, "Error: the value of 'null_val' is not a number");

});

test("Read string-typed values", (t) => {

  let reader = new ConfigReader(path.join(__dirname, 'data/valid.json'));

  assert.deepStrictEqual(reader.read_str('str_val'), {ok: true, value: 'a'});
  assert.deepStrictEqual(reader.read_str_or('str_val', 3), 'a');
  assert.deepStrictEqual(reader.read_str_or_throw('str_val'), 'a');

  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_str('bool_val'), "any");
  }, "Error: the value of 'bool_val' is not a string");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_str_or('bool_val', 'any2'), "any");
  }, "Error: the value of 'bool_val' is not a string");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_str_or_throw('bool_val'), "any");
  }, "Error: the value of 'bool_val' is not a string");

  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_str('num_val'), "any");
  }, "Error: the value of 'num_val' is not a string");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_str_or('num_val', 'any2'), "any");
  }, "Error: the value of 'num_val' is not a string");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_str_or_throw('num_val'), "any");
  }, "Error: the value of 'num_val' is not a string");
  
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_str('null_val'), "any");
  }, "Error: the value of 'null_val' is not a string");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_str_or('null_val', 'any2'), "any");
  }, "Error: the value of 'null_val' is not a string");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_str_or_throw('null_val'), "any");
  }, "Error: the value of 'null_val' is not a string");

});

test("Read bool-typed values", (t) => {

  let reader = new ConfigReader(path.join(__dirname, 'data/valid.json'));

  assert.deepStrictEqual(reader.read_bool('bool_val'), {ok: true, value: true});
  assert.deepStrictEqual(reader.read_bool_or('bool_val', 3), true);
  assert.deepStrictEqual(reader.read_bool_or_throw('bool_val'), true);

  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_bool('str_val'), "any");
  }, "Error: the value of 'str_val' is not a boolean");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_bool_or('str_val', 'any2'), "any");
  }, "Error: the value of 'str_val' is not a boolean");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_bool_or_throw('str_val'), "any");
  }, "Error: the value of 'str_val' is not a boolean");

  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_bool('num_val'), "any");
  }, "Error: the value of 'num_val' is not a boolean");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_bool_or('num_val', 'any2'), "any");
  }, "Error: the value of 'num_val' is not a boolean");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_bool_or_throw('num_val'), "any");
  }, "Error: the value of 'num_val' is not a boolean");
  
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_bool('null_val'), "any");
  }, "Error: the value of 'null_val' is not a boolean");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_bool_or('null_val', 'any2'), "any");
  }, "Error: the value of 'null_val' is not a boolean");
  throws_start_with(() => {
    assert.deepStrictEqual(reader.read_bool_or_throw('null_val'), "any");
  }, "Error: the value of 'null_val' is not a boolean");

});

