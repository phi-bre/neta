import type { NetaObservable, NetaObserver } from './index';
import { resolve } from './core';

/**
 * Returns an observable version of the given value.
 * @param value
 */
export function state<T>(value: T): NetaObservable<T> {
    const observable: NetaObservable<T> = {
        value: undefined,
        observers: new Set<NetaObserver<T>>(),
        set(this: NetaObservable<T>, value: T): NetaObservable<T> {
            this.observers.forEach(observer => observer(value));
            this.value = value;
            return this;
        },
        // FIXME: Return type should be NetaObservable<R>
        then<R>(this: NetaObservable<T>, observer: NetaObserver<T, R>): NetaObservable<R | any> {
            const observable = state(observer(this.value));
            this.observers.add(value => observable.set(observer(value)));
            return observable;
        },
    };
    resolve(value).then(observable.set.bind(observable));
    return observable;
}

// export function combine<T>(...values: Array<NetaObservable<T>>): NetaObservable<Array<T>> {
//     const observable = state([]);
//     for (let i = 0; i < values.length; i++){
//         resolve(values[i]).then(value => {
//             observable.value[i] = value;
//             observable.set(observable.value);
//         });
//     }
//     return observable;
// }
