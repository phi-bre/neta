import type { NetaAttributes, NetaElement, NetaElementDescriptor, NetaElementTagNameMap, NetaStyles } from './index';
import { describe, flattened, layered, middleware, resolve } from './core';

export const element = describe<NetaElement>({
    tag: 'div',
    attributes: describe<NetaAttributes>({}),
    styles: describe<NetaStyles>({}),
    // events,
    children: [],
    then: create,
});

element.then(props => {
    const counter = state(0);
    return {
        counter,
        onclick: e => counter.update(counter => counter + 1),
        text: counter.then(count => `You clicked ${count} times.`),
    };
});

const a = layered({
    tag: 'div',
    attributes: layered({}),
    events: layered({}),
    style: layered({}),
    children: flattened([]),
    create: middleware(function () {
        const element: HTMLElement = this.namespace
            ? document.createElementNS(this.namespace, this.tag)
            : document.createElement(this.tag);

        resolve(this.attributes).then(attributes => {
            for (const key in attributes) {
                resolve(attributes[key]).then(value => {
                    if (typeof value === 'string' || typeof value === 'number') {
                        element.setAttribute(key, value as string);
                    } else {
                        element[key] = value;
                    }
                });
            }
        });

        resolve(this.style).then(style => {
            for (const key in style) {
                resolve(style[key]).then(value => {
                    element.style[key] = value as string;
                });
            }
        });

        resolve(this.children).then(children => {
            // @ts-ignore
            element.replaceChildren(children);
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

        return element;
    }),
    destroy(element) {

    }
});


export function component(props) {
    const counter = state(0);

    return element({

    });
}
