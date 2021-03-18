import * as neta from '../../src';
import readme from '../../README.md';

window.neta = neta;

const dark = neta.state(false);
const background = dark.then(dark => dark ? '#242628' : '#f5f5f5');
const shade = dark.then(dark => dark ? '#292d2e' : '#fff');
const color = dark.then(dark => dark ? '#f5f5f5' : '#242628');

// const text = neta.state('');

neta.document({
    head: [
        // neta.style({
        //     extract: true,
        //     selector: '*',
        //     transition: 'background-color 0.2s, color 0.1s',
        //     padding: 0,
        //     margin: 0,
        //     boxSizing: 'border-box',
        //     fontFamily: '"Fira Sans", sans-serif',
        //     MozOsxFontSmoothing: 'grayscale',
        //     WebkitFontSmoothing: 'antialiased',
        // }),
    ],
    body: neta.element({
        styles: {
            fontFamily: '"Montserrat", sans-serif',
            maxWidth: '1000px',
            marginRight: 'auto',
            marginLeft: 'auto',
            padding: '48px',
            color: color,
        },
        // children: [
        // 'asd',
        // text.then(text => text.split(',').map(part => neta.element({
        //     tag: 'input',
        //     attributes: {
        //         value: part,
        //     },
        // }))),
        // 'blub',
        // 10,
        // [],
        // [[[[[[1000]]]]]],
        // neta.element({
        //     tag: 'input',
        //     attributes: {
        //         oninput: e => text.set(e.target.value)
        //     }
        // }),
        // ]
        html: readme,
    }),
    styles: {
        '*': {
            transition: 'background-color 0.2s, color 0.1s',
            padding: 0,
            margin: 0,
            boxSizing: 'border-box',
            fontFamily: '"Fira Sans", sans-serif',
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
        },
        'h1, h2, h3, h4, h5, h6': {
            fontFamily: '"Montserrat", sans-serif',
            marginTop: '32px',
            marginBottom: '16px',
            cursor: 'pointer',
        },
        'p': {
            fontSize: '16px',
            marginBottom: '16px',
            lineHeight: '28px',
        },
        'a': {
            textDecoration: 'none',
            color: '#5dadff',
            transition: '0.2s',
            // hover: {
            //     opacity: 0.8,
            // },
        },
        'code': {
            fontFamily: '"Fira Code", monospace',
            borderRadius: '4px',
            padding: '2px 6px',
            width: '60%',
            maxWidth: '60%',
            overflowX: 'hidden',
            backgroundColor: shade,
            color: color,
        },
        'body': {
            backgroundColor: background,
            color: color,
        },
        'pre code': {
            backgroundColor: '#292d2e',
            color: '#e5e5e5',
            padding: '32px',
        },
        'pre': {
            display: 'flex',
        },
    },
});

document.querySelector('h1')?.addEventListener('click', () => {
    dark.set(!dark.value);
});

const block = neta.element({
    styles: {
        padding: '32px',
        width: '40%',
        borderRadius: '4px',
        backgroundColor: 'white',
        color: 'initial',
    },
});

document.querySelectorAll('code.language-js').forEach(code => {
    // const parent = window.parent = block.mount(code.parentElement);
    // code.setAttribute('contenteditable', true);
    // code.addEventListener('input', () => {
    //     parent.innerHTML = '';
    //     try {
    //         eval(code.innerText);
    //         // highlight.highlightBlock(code);
    //     } catch (e) {
    //         parent.innerHTML = e;
    //     }
    // }, false);
    // code.dispatchEvent(new Event('input'));
});

document.querySelectorAll('[id]').forEach(heading => {
    heading.addEventListener('click', () => {
        location.hash = heading.id;
        navigator.clipboard.writeText(location);
    });
});
