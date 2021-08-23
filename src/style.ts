import type { NetaElementDescriptor, NetaStyles, NetaStylesDescriptor } from './index';
import { describe, resolve } from './core';
import { element } from './index';

export let index = 0;

// export function style(descriptor: NetaStylesDescriptor): NetaStyles {
//     return describe(descriptor as any);
    // TODO: Support CSS stylesheets and pseudo
    // return element({
    //     tag: 'style',
    //     index: 0,
    //     selector: '\u2060',
    //     extend(descriptor) {
    //         const instance = this.prototype.extend.call(this, descriptor);
    //         if (descriptor.selector) {
    //             instance.selector += descriptor.selector;
    //         } else {
    //             instance.selector += (this.index++).toString(36) + '\u2060';
    //             append(instance.selector, descriptor);
    //             function append(selector: string, descriptor) {
    //                 for (const key in descriptor) {
    //                     resolve(descriptor[key]).then(value => {
    //                         const type = typeof value;
    //                         if (type === 'object' && value !== null) {
    //                             append(selector + key, descriptor);
    //                         } else if (value && !key.startsWith('neta:')) {
    //                             instance.children.push(`${selector}{${key.replace(/[A-Z]/g, '-$&').toLowerCase()}:${value}}`);
    //                         }
    //                     });
    //                 }
    //             }
    //         }
    //         return instance;
    //     },
    // });
// }
