import type { NetaHook } from './index';
import { compose } from './core';

export type NetaHooksDescriptor<E extends Element> = NetaHook<E>;

export interface NetaHooks<E extends Element = Element> extends Array<NetaHook<E>> {
    extend(descriptor: NetaHooksDescriptor<E>): NetaHooks<E>;
    (descriptor: NetaHooksDescriptor<E>): NetaHooks<E>;
}

export const hooks = compose<NetaHooks>(Object.assign([] as any, {
    extend(descriptor) {
        return Object.assign(this.concat(descriptor), { call: this.call });
    },
    call(self, ...args) {
        this.forEach(hook => hook.call?.(self, ...args));
    },
}));
