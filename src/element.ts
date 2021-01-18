import type { NetaComposition, NetaHook } from './index';
import { compose, extend } from './core';
import { attributes, NetaAttributes, NetaAttributesDescriptor } from './attributes';
import { children, NetaChildren, NetaChildrenDescriptor } from './children';
import { NetaStyles, NetaStylesDescriptor, styles } from './styles';
import { hooks } from './hooks';

export interface NetaElementDescriptor<E extends Element = Element> {
    children?: NetaChildrenDescriptor;
    attributes?: NetaAttributesDescriptor<E>;
    styles?: NetaStylesDescriptor;
    created?: NetaHook<E>;
    mounted?: NetaHook<E>;
    destroyed?: NetaHook<E>;
}

export interface NetaElement<E extends Element = Element>
    extends NetaComposition<NetaElementDescriptor<E>, NetaElement<E>> {
    children: NetaChildren<E>;
    attributes: NetaAttributes<E>;
    styles: NetaStyles;
    created: Array<NetaHook<E>>;
    mounted: Array<NetaHook<E>>;
    destroyed: Array<NetaHook<E>>;
    create(element?: E): E;
    mount(parent?: Element): E;
    destroy(element: E): E;
    extend<T extends Element>(descriptor: NetaElementDescriptor<T>): NetaElement<T>;
    <T extends Element>(descriptor: NetaElementDescriptor<T>): NetaElement<T>;
}

export const element = compose<NetaElement>({
    extend,
    attributes,
    children,
    styles,
    created: hooks,
    create(element) {
        element['neta:descriptor'] = this;
        this.attributes.create(element);
        this.children.create(element);
        this.styles.create(element);
        this.created.call(this, element);
        return element;
    },
    mounted: hooks,
    mount(parent) {
        const element = this.create();
        if (parent && document.contains(parent)) {
            parent.append(element);
            document.head.append(this.styles.sheet);
        }
        this.mounted.call(this, element);
        element.querySelectorAll('[neta]').forEach(child => {
            child['neta:descriptor']?.mounted.call(child['neta:descriptor'], child);
        });
        return element;
    },
    destroyed: hooks,
    destroy(element) {
        this.destroyed.call(this, element);
        element.querySelectorAll('[neta]').forEach(child => {
            child['neta:descriptor']?.destroyed.call(child['neta:descriptor'], child);
        });
        return element;
    },
});
