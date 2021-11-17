type Observer<T, A = void> = <R = A>(value: T) => R;

class Observable<T> {
    private static collector?: Observable<any>;
    private value: T;
    private listeners: Set<Observer<T>>;
    private dependencies: Set<Observable<any>>;

    public constructor(value: T) {
        this.listeners = new Set();
        this.dependencies = new Set();
        Observable.collector?.dependencies.add(this);
        this.set(value);
    }

    public set(value: T | Observable<T> | PromiseLike<T>): this {
        if (typeof value === 'object' && value !== null) {
            if (typeof (value as PromiseLike<T>).then === 'function') {
                (value as PromiseLike<T>).then((...args) => {
                    this.set(...args);
                });
                // TODO: What should value be while promise is unresolved?
            } else {
                this.value = Object.create(value as object);
                for (const key in value as T) {
                    new Observable((value as T)[key]).then((v) => {
                        this.value[key] = v;
                        this.listeners.forEach(listener => listener(this.value));
                    });
                }
            }
        } else {
            this.value = value as T;
            this.listeners.forEach(listener => listener(this.value));
        }

        return this;
    }

    public then<R>(callable: Observer<T, R>): Observable<R> {
        const collect_dependencies = (value: T): R => {
            // TODO: if (value === this.value) return;
            this.dependencies.forEach(child => child.destroy());
            this.dependencies.clear();
            // TODO: Check if this works with async actions
            const parent = Observable.collector;
            Observable.collector = this;
            const result = callable(value);
            Observable.collector = parent;
            return result;
        }

        const child = new Observable(collect_dependencies(this.value));
        this.listeners.add(value => {
            child.set(collect_dependencies(value));
        });
        this.dependencies.add(child);
        return child;
    }

    public destroy() {
        this.dependencies.forEach(child => child.destroy());
        this.dependencies.clear();
        this.listeners.clear();
    }
}

/**
 * Returns an observable version of the given value.
 * @param value the initial value of the observable
 */
export function state<T>(value: T): Observable<T> {
    return new Observable<T>(value);
}
