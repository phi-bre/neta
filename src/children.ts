import { compose, normalize, text } from './core';
import { NetaCreatable } from './index';

export const children = compose({
    create(element: Element): Element {
        element['neta:anchors'] = [];
        this.forEach?.((value, index) => normalize((children, previous = []) => {
            const length = [].concat(previous).length;
            const fragment = document.createDocumentFragment();
            fragment.append(...[].concat(children).map(child =>
                typeof (child as NetaCreatable)?.create === 'function'
                    ? (child as NetaCreatable).create()
                    : child instanceof Node ? child : text(child)
            ));
            const anchor = element['neta:anchors'][index];
            element['neta:anchors'][index] = fragment.firstChild;
            if (anchor) {
                for (let i = 1; i < length; i++) {
                    const sibling = anchor.nextSibling;
                    sibling?.['neta:descriptor']?.destroy(sibling);
                    element.removeChild(sibling);
                }
                element.replaceChild(fragment, anchor);
                anchor?.['neta:descriptor']?.destroy(anchor);
            } else {
                element.append(fragment);
            }
        })(value));
        return element;
    },
    extend(descriptor) {
        descriptor.extend = this.extend;
        descriptor.create = this.create;
        return descriptor;
    },
});
