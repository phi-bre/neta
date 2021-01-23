import type { NetaHook } from './index';
import { compose } from './core';

export type NetaEventsDescriptor<E extends Element> = NetaHook<E> | Array<NetaHook<E>>;

export interface NetaEvents<E extends Element = Element> extends Array<NetaHook<E>> {
    create: Event;
    destroy: Event;
    extend(this: NetaEvents<E>, descriptor: NetaEventsDescriptor<E>): NetaEvents<E>;
    (descriptor: NetaEventsDescriptor<E>): NetaEvents<E>;
}

export const events = compose<NetaEvents>(Object.assign([] as any, <NetaEvents>{
    create: document.createEvent('Event'),
    destroy: document.createEvent('Event'),
    extend(descriptor) {
        const instance = this.concat(descriptor) as NetaEvents;
        instance.extend = this.extend;
        return instance;
    },
}));
