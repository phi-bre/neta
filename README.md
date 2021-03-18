<h1 align="center"><code>neta</code></h1>
<p align="center">A lightweight JS framework powered by the prototype chain.</p>

## Introduction
`neta` ネタ — Japanese for the topping of sushi, usually the fish part of nigiri, provides a JS-only framework for the 
modern web. Where other frameworks rely on some special markup language, like JSX, `neta` provides a simple and easy
to use API in plain Javascript. No compilation needed!

## Getting Started
Coming soon...

## Composition
To tell `neta` how to render a DOM-Element, you provide it with something called a `descriptor`, which is just a fancy 
word for an object containing all information about the desired Element. This object will then extend the previously
defined `descriptor`. This way we can add certain properties like styling, attributes, children, etc. on one 
element and override, mix or extend them in another.

Note: `neta` relies on the prototype chain to extend partials. This means, property lookups are handled by the browser 🎉

Simple element creation:

```js
neta.document({
    body: html({ text: 'Hello World!' })
});
```

You can partially apply a `descriptor` and reuse it:

```js
const div = html({ tag: 'div' });
const red = html({ styles: { color: 'red' } });

neta.document({
    body: div(red)({
        children: [
            div({ text: 'Hello World!' }),
        ],
    }),
});
```

### Components
To abstract certain functionalities you can wrap your `descriptor` in a function. This allows you to map the properties
or make invocations only when you actually need them.

```js
function icon({ url }) {
    // Do something here
    return html({
        tag: 'img',
        attributes: {
            src: url,
        },
        styles: {
            width: '100%',
        },
    });
}

neta.document({
    body: html({
        children: [
            icon({
                url: 'https://picsum.photos/200/300',
            }),
        ],
    }),
});
app.mount(parent);
```

## Reactivity
To let `neta` keep track of changes you can pass it an observable instead of any attribute, style or child.
An observable can be a `Promise`, a value wrapped in the provided `state` function, or anything that implements a `then`
function similar to a `Promise` really.

```js
const time = state();

setInterval(() => {
    time.set(new Date().toLocaleTimeString());
}, 1000);

neta.document({
    body: html({ text: time }),
});
```

## Styling
## Hooks
## Helpers
