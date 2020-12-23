import type { CSSProperties } from 'react';
import { define, extend, neta } from './core';
import { NetaCSS, ids } from './css';
import { NetaObserver } from './index';
import { NetaObservable } from './observable';

export const styles: unique symbol = Symbol('neta:style');
export const attributes: unique symbol = Symbol('neta:attribute');
export const created: unique symbol = Symbol('neta:created');
export const mounted: unique symbol = Symbol('neta:mounted');
export const destroyed: unique symbol = Symbol('neta:destroyed');

export class NetaElement<M, E = M[keyof M]> {
    public extend = extend;
    public define = define;
    public tag: keyof M;
    public children: Array<NetaObservable<Node | string | number> | Node | string | number>;
    public html: string;
    public text: string;
    public attributes: Partial<E>;
    public styles: Partial<CSSProperties>;
    public created: NetaObserver<E>;
    public mounted: NetaObserver<E>;
    public destroyed: NetaObserver<E>;

    public constructor() {
        this.children = [];
        const method = (property, value) => property.concat([value]);
        const property = (property, value) => property.extend(value);
        this.define('styles', styles, neta(new NetaCSS()), property, { enumerable: true });
        this.define('attributes', attributes, neta(), property, { enumerable: true });
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
            if (typeof child?.mount === 'function') {
                child.mount(element);
            } else if (typeof child?.then === 'function') {
                new ManagedElement(child).mount(element);
            } else {
                element.append(child);
            }
        }
        this[created].forEach(hook => hook.call(this, element));
        return element;
    }

    public mount(selector: string | Element, replace = false) {
        const parent = typeof selector === 'string' ? document.querySelector(selector) : selector;
        const element = this.create();
        if (replace) {
            parent.replaceWith(element);
        } else {
            parent.append(element);
        }
        this[mounted].forEach(hook => hook.call(this, element));
        return element;
    }

    public destroy(element) {
        this[destroyed].forEach(hook => hook.call(this, element));
        return this;
    }
}

export class ManagedElement<T extends { then }> {
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
            } else if (typeof child.mount === 'function') {
                this.anchor = child.mount(this.anchor, true);
            } else {
                this.anchor = typeof child !== 'object' ? document.createTextNode(child.toString()) : child;
                this.anchor.replaceWith(this.anchor = child);
            }
        });
        parent.append(this.anchor);
        return this.anchor;
    }
}
