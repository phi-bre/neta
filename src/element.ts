import { NetaChild, NetaMountable, styles } from './index';
import { compose, normalize } from './core';

export const attributes = compose({
    create(element: Element) {
        for (const key in this) {
            normalize(this[key], value => {
                if (typeof value === 'function') {
                    element[key] = value;
                } else {
                    element.setAttribute(key, value.toString());
                }
            });
        }
    },
});

export const children = compose({
    value: [],
    create(element: Element) {
        this.value.forEach(child => {
            if (typeof (child as NetaMountable)?.mount === 'function') {
                (child as NetaMountable).mount(element);
            } else if (typeof (child as PromiseLike<NetaChild>)?.then === 'function') {
                managed(child).mount(element);
            } else {
                element.append(child as string | Node);
            }
        });
    },
});

export const hook = compose({
    value: [],
    extend(descriptor) {
        return this.value.concat(descriptor);
    },
});

export const element = compose({
    attributes, styles, children, created: hook, mounted: hook, destroyed: hook,
    create(element: Element) {
        this.styles.create(element);
        this.attributes.create(element);
        this.children.create(element);
        this.created.value.forEach(hook => hook.call(this, element));
        return element;
    },
    mount(parent: ParentNode) {
        const element = this.create();
        parent.append(element);
        this.mounted.value.forEach(hook => hook.call(this, element));
        return element;
    },
    destroy(element: Element) {
        this.destroyed.value.forEach(hook => hook.call(this, element));
        return element;
    },
});

export function managed(value, anchor?) {
    return {
        value,
        anchor: anchor || document.createTextNode(''),
        mount(parent: ParentNode) {
            this.anchor ||= document.createTextNode('');
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
        },
    };
}

export const html = element({
    tag: 'div',
    create(el?: HTMLElement): HTMLElement {
        el ||= document.createElement(this.tag);
        normalize(this.text, value => el.innerText = value);
        normalize(this.html, value => el.innerHTML = value);
        return element.create.call(this, el);
    },
});

export const svg = element({
    tag: 'svg',
    create(el?: SVGElement): SVGElement {
        el ||= document.createElementNS('http://www.w3.org/2000/svg', this.tag);
        return element.create.call(this, el);
    },
});
