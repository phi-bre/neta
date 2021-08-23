import type { NetaAttributes, NetaElement, NetaElementDescriptor, NetaElementTagNameMap, NetaStyles } from './index';
import { describe, resolve } from './core';
import { node } from './document';

export const element = describe<NetaElement>({
    tag: 'div',
    attributes: describe<NetaAttributes>({}),
    styles: describe<NetaStyles>({}),
    // events,
    children: [],
    then(this: NetaElement, fulfill) {
        const element: HTMLElement = this.namespace
            ? document.createElementNS(this.namespace, this.tag) as HTMLElement
            : document.createElement(this.tag);
        resolve(this.attributes).then(attributes => {
            for (const key in attributes) {
                resolve(attributes[key]).then(value => {
                    element[key] = value;
                });
            }
        });
        resolve(this.styles).then(styles => {
            for (const key in styles) {
                resolve(styles[key]).then(value => {
                    element.style[key] = value as string;
                });
            }
        });
        resolve(this.children).then(children => {
            // @ts-ignore
            element.replaceChildren(node(children));
        });
        if (this.text) resolve(this.text).then(text => {
            element.innerText = text as string;
        });
        if (this.html) resolve(this.html).then(html => {
            element.innerHTML = html as string;
        });
        // for (const event of this.events) if (event) {
        //     element.addEventListener(event.type, event.listener, event.options);
        // }
        return resolve(fulfill(element as any));
    },
});

// export function element<K extends keyof NetaElementTagNameMap>(
//     descriptor: NetaElementDescriptor<K>
// ): NetaElement<K> {
//     return prototype(descriptor) as any;
// }
