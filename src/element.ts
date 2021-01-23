import type { NetaComposition, NetaHook } from './index';
import { compose, extend, state } from './core';
import { attributes, NetaAttributes, NetaAttributesDescriptor } from './attributes';
import { fragment, NetaChildren } from './children';
import { NetaStyles, NetaStylesDescriptor, styles } from './styles';
import { events, NetaEvents } from './events';

export interface NetaElementDescriptor<E extends Element = Element> {
    children?: NetaChildren;
    attributes?: NetaAttributesDescriptor<E>;
    styles?: NetaStylesDescriptor;
    created?: NetaHook<E>;
    mounted?: NetaHook<E>;
    destroyed?: NetaHook<E>;
}

export interface NetaElement<E extends Element = Element>
    extends NetaComposition<NetaElementDescriptor<E>, NetaElement<E>> {
    document: { body: HTMLElement, head: HTMLHeadElement };
    attributes: NetaAttributes<E>;
    styles: NetaStyles;
    events: NetaEvents<E>;
    children: NetaChildren;
    create(element: E): E;
    extend<T extends Element>(descriptor: NetaElementDescriptor<T>): NetaElement<T>;
    <T extends Element>(descriptor: NetaElementDescriptor<T>): NetaElement<T>;
}

export const element = compose<NetaElement>({
    document,
    extend,
    attributes,
    styles,
    events,
    children: [],
    create(element: HTMLElement) {
        element.setAttribute('neta', this.styles['neta:id']);
        for (const key in this.attributes) {
            state(attributes[key]).then(value => element.setAttribute(key, value));
        }
        for (const event of this.events) if (event) {
            element.addEventListener(event.type, event.listener, event.options);
        }
        element.append(fragment(this.children));
        return element;
    },
});
