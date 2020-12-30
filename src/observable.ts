import { NetaObserver } from './index';

export class NetaObservable<T> implements PromiseLike<T> {
    public readonly observers: Set<NetaObserver<T>>;
    public value: T;

    public constructor(value: T) {
        this.observers = new Set();
        this.set(value);
    }

    public set(value: T) {
        this.observers.forEach(observer => observer(value, this.value));
        this.value = value;
        return this;
    }

    public then<R>(observer: NetaObserver<T, R>): NetaObservable<R | any> {
        const observable = new NetaObservable(observer(this.value, undefined));
        this.observers.add(value => observable.set(observer(value, this.value)));
        return observable;
    }
}
