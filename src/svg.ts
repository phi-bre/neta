import { NetaElement } from './element';

export class NetaSVG extends NetaElement<SVGElementTagNameMap> {
    public create() {
        const element = document.createElementNS('http://www.w3.org/2000/svg', this.tag);
        return super.create(element);
    }
}
