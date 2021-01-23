import type { NetaChild, NetaPrimitive } from './index';
import { events } from './events';
import { state } from './core';

export type NetaChildren = Array<NetaChild | PromiseLike<NetaChild> | Array<NetaChild> | PromiseLike<Array<NetaChild>>>;

export function text(value: NetaPrimitive): Text {
    const type = typeof value;
    return document.createTextNode(type === 'string' || type === 'number' || type === 'bigint' ? type : '');
}

export function node(value: NetaChild): Node | Element | Text {
    return value instanceof Node ? value : text(value as NetaPrimitive);
}

export function fragment(children: NetaChildren) {
    const element = document.createDocumentFragment();
    for (const child of children) {
        let anchor: Node = document.createTextNode('');
        element.append(anchor);
        state(child).then(child => {
            const values = [].concat(child);
            for (let i = 1; i < (anchor['neta:anchor'] || 1); i++) {
                element.removeChild(anchor.nextSibling).dispatchEvent(events.destroy);
            }
            for (let i = 0; i < values.length - 1; i++) {
                element.insertBefore(node(values[i]), anchor).dispatchEvent(events.create);
            }
            const newAnchor = node(values[values.length - 1]);
            element.replaceChild(newAnchor, anchor).dispatchEvent(events.destroy);
            (anchor = newAnchor).dispatchEvent(events.create);
            anchor['neta:anchor'] = values.length;
        });
    }
    return element;
}
