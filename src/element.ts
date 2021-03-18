import type { NetaAttributes, NetaChild, NetaElement, NetaElementDescriptor, NetaElementTagNameMap, NetaPrimitive, NetaStyles } from './index';
import { describe, resolve } from './core';

export function node(value: NetaChild): Node {
    if (value instanceof Node) {
        return value;
    } else if (Array.isArray(value)) {
        return fragment(value);
    } else {
        const type = typeof value;
        return document.createTextNode(
            type === 'string' || type === 'number' || type === 'bigint' ? value as string : ''
        );
    }
}

export function fragment(values: Array<NetaChild>): DocumentFragment {
    const element = document.createDocumentFragment();
    for (const value of values) {
        let anchor: Node = element.appendChild(document.createTextNode(''));
        resolve(value).then(value => {
            for (let i = 1, length = anchor['neta:anchor'] || 1; i < length; i++) {
                length -= anchor.nextSibling['neta:anchor'] || 0;
                anchor.parentNode.removeChild(anchor.nextSibling);
            }
            const child = node(value);
            let first: Node;
            if (child instanceof DocumentFragment) {
                first = child.firstChild || document.createTextNode('');
                first['neta:anchor'] = child.childNodes.length;
            }
            anchor.parentNode.replaceChild(child, anchor);
            anchor = first;
        });
    }
    return element;
}

const prototype = describe<NetaElement<'div'>>({
    tag: 'div',
    attributes: describe<NetaAttributes<'div'>>({}),
    styles: describe<NetaStyles>({}),
    // events,
    children: [],
    then(this: NetaElement<'div'>, fulfill) {
        const element: HTMLElement = this.namespace
            ? document.createElementNS(this.namespace, this.tag) as HTMLElement
            : document.createElement(this.tag);
        for (const key in this.attributes) {
            resolve(this.attributes[key]).then(value => element[key] = value);
        }
        if (this.styles.selector) {
            element.setAttribute('neta', this.styles.selector);
        } else for (const key in this.styles) {
            resolve(this.styles[key]).then(value => element.style[key] = value as string);
        }
        // for (const event of this.events) if (event) {
        //     element.addEventListener(event.type, event.listener, event.options);
        // }
        resolve(this.text).then(value => value && (element.innerText = value as string));
        resolve(this.html).then(value => value && (element.innerHTML = value as string));
        element.appendChild(fragment(this.children));
        return resolve(fulfill(element as any));
    },
});

export function element<K extends keyof NetaElementTagNameMap>(
    descriptor: NetaElementDescriptor<K>
): NetaElement<K> {
    return prototype(descriptor) as any;
}
