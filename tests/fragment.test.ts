import { fragment } from '../src/element';

describe('fragment', function () {
    describe('when passed a primitive', function () {
        const values = ['string', '', 1, 0];

        it('should map to text node', function () {
            expect([...fragment(values).childNodes]).toEqual(values.map(value => new Text(value.toString())));
        });
    });

    describe('when passed an empty primitive', function () {
        const values = ['', true, false, null, undefined];

        it('should map to empty text node', function () {
            expect([...fragment(values).childNodes]).toEqual(values.map(() => new Text()));
        });
    });

    describe('when passed an array', function () {
        const values = [['first', 'second']];

        it('should contain its values as direct children', function () {
            expect([...fragment(values).childNodes]).toEqual(values[0].map(value => new Text(value)));
        });
    });

    describe('when passed a node', function () {
        const values = [document.createElement('div')];

        it('should keep as node', function () {
            expect([...fragment(values).childNodes]).toEqual(values);
        });
    });

    describe('when passed a thenable', function () {
        const value = 'string';
        const thenable = Promise.resolve(value);
        const element = fragment([thenable]);

        it('should keep as node', async function () {
            expect(element.firstChild).toEqual(new Text());
            await thenable;
            expect(element.firstChild).toEqual(new Text(value));
        });

        describe('remove', function () {

        });

        describe('update', function () {

        });
    });
});
