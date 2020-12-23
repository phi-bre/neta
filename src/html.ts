import { NetaElement } from './element';

export class NetaHTML extends NetaElement<HTMLElementTagNameMap> {
    public create(): HTMLElement {
        const element = document.createElement(this.tag);
        this.set(this.text, value => element.innerText = value);
        this.set(this.html, value => element.innerHTML = value);
        return super.create(element);
    }
}
