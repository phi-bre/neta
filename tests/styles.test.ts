import { style } from '../src/styles';

describe('styles', function () {
    beforeEach(() => {
        style.index = 0;
    });

    describe('#create', function () {
        it('should set the attribute "neta" to the sum of indexes', function () {
            const element = document.createElement('div');
            style({ color: '#fff' }).create(element);
            expect(element.getAttribute('neta')).toEqual('\u20601\u2060');
        });
    });

    describe('#extend', function () {
        describe('when descriptor is plain object', function () {
            const descriptor = { color: '#fff' };

            it('should increase index', function () {
                style(descriptor)(descriptor);
                expect(style.index).toEqual(1);
            });

            it('should call append with the passed descriptor', function () {
                const append = jest.spyOn(style, 'append');
                style(descriptor);
                expect(append).toBeCalledWith(descriptor);
            });
        });

        describe('when descriptor is another styles', function () {
            const descriptor = style({ color: '#fff' });

            it('should merge the ids', function () {
                const merged = style(descriptor);
                expect(merged['neta:selector']).toEqual('');
            });

            it('should NOT call append', function () {
                const append = jest.spyOn(style, 'append');
                style(descriptor);
                expect(append).not.toBeCalled();
            });
        });
    });

    describe('#append', function () {
        describe('when passed an object', function () {
            it('should apply styles', function () {

            });

            describe('when object includes nested objects', function () {
                describe('when key starts with @', function () {
                    it('should apply styles as @ syntax', function () {

                    });
                });

                describe('when key starts with : or default', function () {
                    it('should apply styles as pseudo', function () {

                    });
                });
            });
        });

        describe('when passed a primitive', function () {

        });

        describe('when passed a function', function () {

        });
    });
});
