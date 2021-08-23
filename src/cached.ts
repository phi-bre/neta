import { describe } from './core';

export const cache = {};

describe({
    key: undefined,
    then(fulfill) {
        return super.then(fulfill);
    },
});
