import { NetaElement } from './index';
import { compose } from './core';
import { attributes } from './attributes';
import { children } from './children';
import { styles } from './styles';
import { hooks } from './hooks';

export const element = compose<NetaElement>({
    attributes,
    children,
    styles,
    created: hooks,
    create(element: Element): Element {
        element['neta:descriptor'] = this;
        this.attributes.create(element);
        this.children.create(element);
        this.styles.create(element);
        this.created.call(this, element);
        return element;
    },
    mounted: hooks,
    mount(parent: Element, element?: Element) {
        element ||= this.create();
        parent?.append(element);
        this.mounted.call(this, element);
        element.querySelectorAll('[neta]').forEach(child => {
            child['neta:descriptor']?.mount(null, child);
        });
        return element;
    },
    destroyed: hooks,
    destroy(element: Element) {
        this.destroyed.call(this, element);
        element.querySelectorAll('[neta]').forEach(child => {
            child['neta:descriptor']?.destroy(child);
        });
        return element;
    },
});
