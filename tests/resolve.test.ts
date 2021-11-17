import { resolve } from '../src/core';

describe('#resolve', function () {
  const primitives = [1, 0, true, false, '', 'foo', Symbol('foo'), undefined, null];

  primitives.forEach(primitive => {
    it(`should resolve primitive "${String(primitive ? primitive.toString() : primitive)}"`, function (done) {
      resolve(primitive)
        .then(value => {
          expect(value).toBe(primitive);
          done();
        });
    });
  });

  it('should resolve primitives synchronously', function () {
    const actual = primitives.map(primitive => {
      let value;
      resolve(primitive).then(v => value = v);
      return value;
    });
    expect(actual).toEqual(primitives);
  });

  it('should resolve promises', function (done) {
    // TODO: Should promises at the top level force an async behavior?
    const resolved = resolve(Promise.resolve('value'))
    let counter = 0;

    resolved.then(value => {
      if (counter === 0) {
        expect(value).toBe(undefined);
        counter++;
      } else {
        expect(value).toBe('value');
        done();
      }
    });
  });

  it('should resolve object properties individually', function (done) {
    const object = { foo: 'foo', bar: 'bar' };
    const resolved = resolve(object);

    resolved.then(value => {
      expect(value).toEqual(object);
      done();
    });
  });

  it('should resolve other resolved values', function (done) {
    const resolved = resolve(resolve('foo'));

    resolved.then(value => {
      expect(value).toBe('foo');
      done();
    });
  });

  it('should resolve nested resolved values', function (done) {
    const resolved = resolve({ foo: resolve('foo'), bar: resolve('bar') });

    resolved.then(value => {
      expect(value).toEqual({ foo: 'foo', bar: 'bar' });
      done();
    });
  });

  it('should respect the initial data type', function (done) {
    // TODO: Add more types e.g. Date, Classes
    const resolved = resolve([resolve('foo'), resolve('bar')]);

    resolved.then(value => {
      expect([...value]).toEqual(['foo', 'bar']);
      done();
    });
  });

  describe('chaining of resolved values', function () {
    const resolved = resolve('foo')
      .then(value => value + 'bar');
  });

  describe('memory safety', function () {
    const fn = jest.fn();
    const dependent = resolve('foo');
    const condition = resolve({ boolean: false });
    condition
      .then(con => {
        if (con.boolean) {
          return dependent.then(dep => dep + 'bar');
        }
      })
      .then(fn);

    expect(fn).toHaveBeenLastCalledWith(undefined);
    expect(condition.dependencies.size).toEqual(1);

    condition.set({ boolean: true });
    expect(fn).toHaveBeenLastCalledWith('foobar');
    expect(condition.dependencies.size).toEqual(2);

    condition.set({ boolean: false });
    expect(fn).toHaveBeenLastCalledWith(undefined);
    expect(condition['dependencies'].size).toEqual(1);

    condition.destroy();
    expect(condition.dependencies.size).toEqual(0);
    // TODO: Check if children were also destroyed
  });
});
