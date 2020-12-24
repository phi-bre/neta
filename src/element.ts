import { NetaExtendable, NetaChild, NetaMountable, NetaObserver } from './index';
import { define, extend, neta } from './core';
import { ids, NetaCSS } from './css';

export const styles: unique symbol = Symbol('neta:style');
export const attributes: unique symbol = Symbol('neta:attribute');
export const created: unique symbol = Symbol('neta:created');
export const mounted: unique symbol = Symbol('neta:mounted');
export const destroyed: unique symbol = Symbol('neta:destroyed');

export class NetaElement<M, E extends Element> implements NetaMountable, NetaExtendable<NetaElement<M, E>> {
    public readonly extend = extend;
    public readonly define = define;
    public readonly tag: keyof M;
    public children: Array<NetaChild | PromiseLike<NetaChild>>;
    public html?: string | PromiseLike<string>;
    public text?: string | PromiseLike<string>;
    public attributes: { [P in keyof E]?: E[P] extends (string | number | boolean) ? (E[P] | PromiseLike<E[P]>) : never };
    public styles: object;
    public created: NetaObserver<E>;
    public mounted: NetaObserver<E>;
    public destroyed: NetaObserver<E>;

    public constructor() {
        this.children = [];
        const method = (property, value) => property.concat([value]);
        const property = (property, value) => property.extend(value);
        this.define('styles', styles, new NetaCSS(), property, { enumerable: true });
        this.define('attributes', attributes, neta({ extend }) as any, property, { enumerable: true });
        this.define('created', created, [], method);
        this.define('mounted', mounted, [], method);
        this.define('destroyed', destroyed, [], method);
    }

    protected set(attribute, action) {
        if (typeof attribute?.then === 'function') {
            attribute.then(action);
        } else if (attribute) {
            action(attribute);
        }
    }

    public create(element?: E) {
        if (this.styles[ids]) {
            element.setAttribute('neta', this.styles[ids]);
        }
        for (const key in this.attributes) {
            this.set(this.attributes[key], value => {
                if (typeof value === 'function') {
                    element[key] = value;
                } else {
                    element.setAttribute(key, value.toString());
                }
            });
        }
        for (const child of this.children) {
            if (typeof (child as NetaMountable)?.mount === 'function') {
                (child as NetaMountable).mount(element);
            } else if (typeof (child as PromiseLike<NetaChild>)?.then === 'function') {
                new ManagedElement(child as PromiseLike<NetaChild>).mount(element);
            } else {
                element.append(child as string | Node);
            }
        }
        this[created].forEach(hook => hook.call(this, element));
        return element;
    }

    public mount(parent: ParentNode): E {
        const element = this.create();
        parent.append(element);
        this[mounted].forEach(hook => hook.call(this, element));
        return element;
    }

    public destroy(element: E) {
        this[destroyed].forEach(hook => hook.call(this, element));
        return this;
    }
}

export class ManagedElement<T extends PromiseLike<NetaChild>> implements NetaMountable {
    public anchor: ChildNode;
    public value: T;

    public constructor(value: T, anchor?: ChildNode) {
        this.anchor = anchor || document.createTextNode('');
        this.value = value;
    }

    public mount(parent: ParentNode) {
        this.value.then(child => {
            if (!child) {
                this.anchor = document.createTextNode('');
            } else if (typeof (child as NetaMountable).mount === 'function') {
                this.anchor = (child as NetaMountable).mount(this.anchor as any);
            } else {
                this.anchor = typeof child !== 'object' ? document.createTextNode(child.toString()) : child as ChildNode;
                this.anchor.replaceWith(this.anchor = child as ChildNode);
            }
        });
        parent.append(this.anchor);
        return this.anchor;
    }
}
