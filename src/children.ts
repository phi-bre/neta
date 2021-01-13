import { compose, node, state } from './core';

export const children = compose({
    create(element: Element): Element {
        this.forEach?.(child => {
            let anchor: Node = document.createTextNode('');
            element.append(anchor);
            state(child).then(child => {
                const values = [].concat(child);
                for (let i = 1; i < (anchor['neta:anchor'] || 1); i++) {
                    element.removeChild(anchor.nextSibling);
                }
                for (let i = values.length - 2; i >= 0; i--) {
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
        descriptor.extend = this.extend;
        descriptor.create = this.create;
        return descriptor;
    },
});
