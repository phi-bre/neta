import type { NetaObservable } from '../src/index';
import { state } from '../src/state';

describe('state', function () {
    let value: number = 1;
    let observer: jest.Mock;
    let observable: NetaObservable<number>;

    beforeEach(function () {
        observer = jest.fn();
        observable = state(value);
        observable.then(observer);
    });

    describe('when set is called', function () {
        let nextValue: number = 2;
        
        beforeEach(function () {
            observable.set(nextValue);
        });
        
        it('should set the next value', function () {
            expect(observable.value).toEqual(nextValue);
        });

        it('should trigger the observer with the next value', function () {
            expect(observer).toHaveBeenCalledWith(nextValue);
        });
    });

    // it('does not leak memory', function () {
    //     let observer = jest.fn();
    //     observable.set(0);
    //     observable.then(observer);
    //     observable.set(0);
    //     expect(observer).toHaveBeenCalledTimes(1);
    // });
});
