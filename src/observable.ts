import { NetaObserver } from './index';

export class NetaObservable<T> {
    public readonly observers: Set<NetaObserver<T>>;
    public value: T;

    public constructor(value: T) {
        this.observers = new Set();
        this.set(value);
    }

    public set(value: T) {
        this.observers.forEach(observer => observer(value, this.value))
        // for (const observer of this.observers) {
        //     console.log(observer)
        //     observer(value, this.value);
        // }
        // if (typeof value === 'object') {
        //     for (const key in value) {
        //         if (key in this) {
        //
        //         } else {
        //             Object.defineProperty(this, key, {
        //                 get: () => this.pipe(value => value?.[key]),
        //             });
        //         }
        //     }
        // }
        this.value = value;
        return this;
    }

    public then(observer: NetaObserver<T>): this {
        this.observers.add(observer);
        return this;
    }

    public pipe<R>(observer: NetaObserver<T, R>): NetaObservable<R> {
        const observable = new NetaObservable(observer(this.value, this.value));
        this.then(value => observable.set(observer(value, this.value)));
        return observable;
    }
}
