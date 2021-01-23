import * as helpers from '../src/helpers';

describe('text', function () {
    it('creates a correct text node', function () {
        ['string', 0, 1].forEach(value => {
            expect(helpers.text(value).data).toStrictEqual(value.toString());
        });
    });

    it('coerces empty values', function () {
        ['', true, false, null, undefined].forEach(value => {
            expect(helpers.text(value).data).toStrictEqual('');
        });
    });
});
