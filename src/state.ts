import type { NetaObservable, NetaObserver } from './index';
import { resolve } from './core';

/**
 * Returns an observable version of the given value.
 * @param values
 */
export function state<T extends []>(...values: T): NetaObservable<T> {
    const observable: NetaObservable<T> = {
        values: [],
        get value() {
            return this.values[0];
        },
        observers: new Set<NetaObserver<T>>(),
        set(this: NetaObservable<T>, ...values: T): NetaObservable<T> {
            this.observers.forEach(observer => observer(...values));
            this.values = values;
            return this;
        },
        // FIXME: Return type should be NetaObservable<R>
        then<R>(this: NetaObservable<T>, observer: NetaObserver<T, R>): NetaObservable<R | any> {
            const observable = state(observer(this.value));
            this.observers.add((...values) => observable.set(observer(...values)));
            return observable;
        },
    };
    values.forEach((value, index) => resolve(value).then(value => {
        observable.values[index] = value;
        observable.observers.forEach(observer => observer(...observable.values));
    }));
    return observable;
}
