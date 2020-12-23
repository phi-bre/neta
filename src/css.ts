import { define, snake } from './core';

export const ids: unique symbol = Symbol('neta:id');
export const delimiter = '\u2060';

export class NetaCSS {
    static index = 0;
    static stylesheet = document.createElement('style');
    public define = define;
    public readonly id: number;

    public constructor() {
        this.define('id', ids, '', (property, value) => property + value);
    }

    private static identifier(index: number) {
        return delimiter + index.toString(36) + delimiter;
    }

    public static global(descriptor: object) {
        for (const key in descriptor) {
            this.stylesheet.append(...this.append(descriptor[key], key));
        }
    }

    public static append(descriptor: object, selector?: string, at?: string): string[] {
        selector ||= `[neta*="${NetaCSS.identifier(NetaCSS.index)}"]`;
        let body = '', nested = [];
        for (const key in descriptor) {
            const type = typeof descriptor[key];
            if (type === 'object') {
                nested.push(...this.append.apply(this,
                    key.startsWith('@')
                        ? [descriptor[key], selector, key]
                        : [descriptor[key], selector + ':' + key]
                ));
            } else if (type === 'string' || type === 'number') {
                body += snake(key) + ':' + descriptor[key] + ';';
            }
        }
        if (body) {
            nested.unshift(at ? `${at}{${selector}{${body}}}` : `${selector}{${body}}`);
        }
        return nested;
    }

    public extend(descriptor: object): this {
        return Object.assign(Object.create(this), {
            id: descriptor[ids]
                || NetaCSS.stylesheet.append(...NetaCSS.append(descriptor))
                || NetaCSS.identifier(NetaCSS.index++),
        });
    }
}
