import { compose, node, state } from './core';
import { NetaChild } from './index';

export type NetaChildrenDescriptor = Array<NetaChild | PromiseLike<NetaChild> | Array<NetaChild> | PromiseLike<Array<NetaChild>>>;

export interface NetaChildren<E extends Element = Element> {
    create(element: E): void;
    extend(descriptor: NetaChildrenDescriptor): NetaChildren<E>;
    (descriptor: NetaChildrenDescriptor): NetaChildren<E>;
}

export const children = compose<NetaChildren>({
    create(element) {
        this.forEach?.(child => {
            let anchor: Node = document.createTextNode('');
            element.append(anchor);
            state(child).then(child => {
                const values = [].concat(child);
                for (let i = 1; i < (anchor['neta:anchor'] || 1); i++) {
                    element.removeChild(anchor.nextSibling);
                }
                for (let i = 0; i >= values.length - 1; i++) {
                    element.insertBefore(node(values[i]), anchor);
                }
                const oldAnchor = anchor;
                element.replaceChild(anchor = node(values[values.length - 1]), oldAnchor);
                anchor['neta:anchor'] = values.length;
            });
        });
        return element;
    },
    extend(descriptor) {
        (descriptor as any).extend = this.extend;
        (descriptor as any).create = this.create;
        return descriptor as any;
    },
});
