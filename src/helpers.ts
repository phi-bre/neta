import { NetaObservable } from './observable';
import { normalize, snake } from './core';
import { element } from './element';

export const html = element({
    create(el?: HTMLElement): HTMLElement {
        el ||= document.createElement(this.tag || 'div');
        normalize(value => value ? el.innerText = value : null)(this.text);
        normalize(value => value ? el.innerHTML = value : null)(this.html);
        return element.create.call(this, el);
    },
});

export const svg = element({
    create(el?: SVGElement): SVGElement {
        el ||= document.createElementNS('http://www.w3.org/2000/svg', this.tag || 'svg');
        return element.create.call(this, el);
    },
});

export function media(value: object): string {
    return `@media screen and (${Object.keys(value).map(key => snake(key) + ':' + value[key]).join(';')})`;
}

export function state<T>(value: T) {
    return new NetaObservable<T>(value);
}
