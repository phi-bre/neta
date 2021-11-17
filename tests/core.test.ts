import { resolve, extend, describe as desc } from '../src/core';

describe('resolve', function () {
    let value: any;

    describe('when passed anything but a thenable', function () {
        beforeEach(function () {
            value = { hello: 'world' };
        });

        it('should normalize the value to thenable form', function () {
            expect(resolve(value).then).toBeInstanceOf(Function);
        });

        it('should resolve synchronously', function () {
            const observer = jest.fn();
            resolve(value).then(observer);
            expect(observer).toHaveBeenCalledWith(value);
        });
    });

    describe('when passed a thenable', function () {
        beforeEach(function () {
            value = Promise.resolve(10);
        });

        it('should return the thenable', function () {
            expect(resolve(value)).toEqual(value);
        });
    });
});

describe('extend', function () {
    let prototype: any, descriptor: any, extended: any;

    describe('when passed a plain object', function () {
        beforeEach(function () {
            prototype = { property: 1 };
            descriptor = { property: 2 };
            extended = extend.call(prototype, descriptor);
        });

        it('should create a new object extending prototype with the properties of the descriptor', function () {
            expect(extended).not.toBe(prototype);
            expect(extended).not.toBe(descriptor);
            expect(extended.property).toEqual(descriptor.property);
            expect(Object.getPrototypeOf(extended).property).toEqual(prototype.property);
        });
    });

    describe('when a property has an extend method', function () {
        beforeEach(function () {
            prototype = { property: { extend: jest.fn().mockReturnValue(3) } };
            descriptor = {};
            extended = extend.call(prototype, descriptor);
        });

        it('should call the extend method', function () {
            expect((prototype.property as any).extend).toHaveBeenCalledWith(descriptor.property);
            expect(extended.property).toEqual(3);
        });
    });
});

describe('describe', function () {
    let prototype: any, descriptor: any, instance: any;

    describe('when prototype is a plain object', function () {
        beforeEach(function () {
            prototype = { property: 'prototype' };
            instance = desc(prototype);
        });

        it('should create a function with correct properties', function () {
            expect(instance.property).toEqual(prototype.property);
        });
    });

    describe('when returned instance is called', function () {
        beforeEach(function () {
            prototype = { property: 'prototype' };
            descriptor = { property: 'descriptor' };
            instance = desc(prototype)(descriptor);
        });

        it('should extend the described object', function () {
            expect(instance.property).toEqual(descriptor.property);
        });

        describe('when prototype overrides extend', function () {
            beforeEach(function () {
                prototype = { extend: jest.fn().mockImplementation(() => extend.call(prototype, descriptor)) };
                descriptor = { property: 'descriptor' };
                instance = desc(prototype)(descriptor);
            });

            it('should call the extend method', function () {
                expect(prototype.extend).toHaveBeenCalledWith(descriptor);
                expect(prototype.extend.mock.instances[0]).toBe(prototype);
            });
        });
    });
});
