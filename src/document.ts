import type { NetaChild, NetaDocument } from './index';
import { flattened, resolve } from './core';
//
// export function node(value: NetaChild): Node {
//     if (value instanceof Node) {
//         return value;
//     } else if (Array.isArray(value) && value.length > 0) {
//         return fragment(value);
//     } else {
//         const type = typeof value;
//         return window.document.createTextNode(
//             type === 'string' || type === 'number' || type === 'bigint' ? value as string : ''
//         );
//     }
// }
//
// export function fragment(values: Array<NetaChild>): DocumentFragment {
//     const element = window.document.createDocumentFragment();
//     for (const value of values) {
//         let anchor: Node = element.appendChild(window.document.createTextNode(''));
//         resolve(value).then(value => {
//             for (let i = 1, length = anchor['neta:anchor'] || 1; i < length; i++) {
//                 length -= anchor.nextSibling['neta:anchor'] || 0;
//                 anchor.parentNode.removeChild(anchor.nextSibling);
//             }
//             const child = node(value);
//             let first: Node;
//             if (child instanceof DocumentFragment) {
//                 first = child.firstChild;
//                 first['neta:anchor'] = child.childNodes.length;
//             } else {
//                 first = child;
//             }
//             anchor.parentNode.replaceChild(child, anchor);
//             anchor = first;
//         });
//     }
//     return element;
// }

/**
 * Mounts a neta document to a given target.
 * @param target An object defining the target nodes where body and head should be mounted on
 * @param body The neta element to mount onto the target's body
 * @param head The neta element to mount onto the target's head
 */
export function document({ target = window.document, body, head }: Partial<NetaDocument>) {
    // @ts-ignore
    flattened(head).then(head => target.head.replaceChildren(head));
    // @ts-ignore
    flattened(body).then(body => target.body.replaceChildren(body));
}
