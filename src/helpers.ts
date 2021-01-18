import { snake } from './core';
import { NetaStylesDescriptor, styles } from './styles';

export function media(value: object): string {
    return `@media screen and (${Object.keys(value).map(key => snake(key) + ':' + value[key]).join(';')})`;
}

export function global(descriptor: Record<string, NetaStylesDescriptor>) {
    for (const key in descriptor) {
        styles.append({ ['neta:selector']: key, ...descriptor[key] } as any);
    }
}
