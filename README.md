# `neta`
A lightweight JS framework powered by the prototype chain.

## Introduction
The aim of `neta` (Japanese for the topping of sushi, usually the fish part of nigiri) is to provide a JS only framework
for the modern web. Other frameworks rely on some special markup language, like JSX, or lack the ability to seamlessly
integrate dynamic CSS depending on component state. A nice side effect of this is that `neta` and all of its features 
can be used without the need for compilation.

## Getting Started
Coming soon...

## Composition
To tell `neta` how to render a DOM-Element, you provide it with something called a `descriptor`, which is just a fancy 
word for an object containing all information about the Element. This object will then extend the previous declaration's
`descriptor`. This way we can define certain properties like styling, attributes, children, etc. or override them from 
other descriptions.

Hint: `neta` relies on the prototype chain to extend partials. This means, property lookups are run natively :tada:

Simple element creation:
```js
const app = html({ text: 'Hello World!' });
app.mount(parent);
```

### Partials
You can partially apply a `descriptor` and reuse it wherever you want.

```js
const div = html({ tag: 'div' });
const app = div({
    styles: {
        color: '#5dadff',
    },
    children: [
        div({ text: 'Hello World!' }),
    ],
});
app.mount(parent);
```

### Components
To abstract certain functionalities you can wrap your `descriptor` in a function. This allows you to map the properties
or make invocations only when you actually need them.

```js
function icon({ path }) {
    // Do something
    return html({
        tag: 'img',
        attributes: {
            src: 'https://cat.photos/' + path,
        },
    });
}

const app = html({
    children: [
        icon({ path: 'nyan-cat.png' }),
    ],
});
app.mount(parent);
```

## Reactivity
To let `neta` know whenever something changed you can pass it an observable instead of any attribute, style or child.
An observable can be a `Promise`, a value of your choosing wrapped in the provided `state` function, or anything that 
implements a `then` function similar to a `Promise` really.

```js
const message = state('hello');
const app = html({ text: message });
message.set('world!');
app.mount(parent);
```

## Styling
## Hooks
## Helpers
