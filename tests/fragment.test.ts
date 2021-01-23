import { element } from '../src/element';
import { fragment } from '../src/children';

describe('element', function () {
    describe('children', function () {
        // describe('when empty', function () {
        //     const instance = fragment([]);
        //
        //     it('should contain an anchor', function () {
        //         expect(instance.childNodes).toHaveLength(1);
        //         expect((instance.firstChild as Text).data).toEqual('');
        //     });
        // });

        describe('when passed a primitive', function () {
            const text = 'text';
            const element = fragment([text]);

            it('should contain it as a child', async function () {
                expect(element.childNodes).toHaveLength(1);
                await element.firstChild;
                expect((element.firstChild as Text).data).toEqual(text);
            });
        });

        describe('when passed an array', function () {
            const array = ['first', 'second'];
            const element = fragment([array]);

            it('should contain its values as direct children', async function () {
                expect(element.childNodes).toHaveLength(1);
                await Promise.all(element.childNodes);
                for (const childNode of element.childNodes) {
                    console.log(childNode);
                }
                expect(Array.from(element.childNodes).map((text: Text) => text.data)).toContain(array);
            });
        });

        describe('when passed a promise', function () {
            const array = ['first', 'second'];
            const element = fragment([array]);

            it('should contain its values as direct children', async function () {
            });
        });
    });
});
