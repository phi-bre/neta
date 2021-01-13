import { compose } from './core';

export const hooks = compose([])({
    extend(descriptor) {
        return Object.assign(this.concat(descriptor), { call: this.call });
    },
    call(self, ...args) {
        this.forEach(hook => hook.call?.(self, ...args));
    },
} as any);
