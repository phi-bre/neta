import { NetaCreatable, NetaElement, styles } from './index';
import { compose, normalize, text } from './core';

export const attributes = compose({
    create(element: Element) {
        for (const key in this) {
            normalize(value => {
                typeof value === 'function'
                    ? element[key] = value
                    : element.setAttribute(key, value.toString())
            })(this[key]);
        }
    },
});

export const children = compose<any>([])({
    create(element: Element): Element {
        element['neta:anchors'] = [];
        this.forEach((value, index) => normalize((children, previous = []) => {
            const length = [].concat(previous).length;
            const fragment = document.createDocumentFragment();
            fragment.append(...[].concat(children).map(child =>
                typeof (child as NetaCreatable)?.create === 'function'
                    ? (child as NetaCreatable).create()
                    : child instanceof Node ? child : text(child)
            ));
            const anchor = element['neta:anchors'][index];
            element['neta:anchors'][index] = fragment.firstChild;
            for (let i = 1; i < length; i++) element.removeChild(anchor?.nextSibling);
            if (anchor) element.replaceChild(fragment, anchor);
            else element.append(fragment);
        })(value));
        return element;
    },
    extend(descriptor: any) {
        descriptor.extend = this.extend;
        descriptor.create = this.create;
        descriptor.insert = this.insert;
        return descriptor;
    },
});

export const hook = compose([])({
    extend(descriptor) {
        return this.concat(descriptor);
    },
});

export const element = compose<NetaElement>({
    attributes, styles, children,
    created: hook, mounted: hook, destroyed: hook,
    create(element: Element): Element {
        this.styles.create(element);
        this.attributes.create(element);
        this.children.create(element);
        this.created.forEach(hook => hook.call?.(this, element));
        return element;
    },
    mount(parent: Element) {
        const element: Element = this.create();
        parent.append(element);
        // TODO: element.querySelectorAll('[neta]').forEach(child => {});
        this.mounted.forEach(hook => hook.call?.(this, element));
        return element;
    },
    destroy(element: Element) {
        this.destroyed.forEach(hook => hook.call?.(this, element));
        return element;
    },
});

export const html = element({
    tag: 'div',
    create(el?: HTMLElement): HTMLElement {
        el ||= document.createElement(this.tag);
        normalize(value => value ? el.innerText = value : null)(this.text);
        normalize(value => value ? el.innerHTML = value : null)(this.html);
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
