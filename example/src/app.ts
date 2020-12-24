import highlight from 'highlight.js';
import { html, state } from '../../src';
import { NetaCSS } from '../../src/css';
import readme from '../../README.md';

(window as any).html = html;
(window as any).state = state;

const background = state('#242628');
const color = state('#fff');

NetaCSS.global({
    body: {
        backgroundColor: background,
        color: color,
        transition: 'background-color 0.2s, color 0.2s',
    },
});

const app = html({
    styles: {
        fontFamily: '"Montserrat", sans-serif',
        maxWidth: '900px',
        marginRight: 'auto',
        marginLeft: 'auto',
        padding: '48px',
    },
    html: readme,
});

app.mount('body');

background.then(console.log)

window.addEventListener('click', () => {
    let temp = background.value;
    background.set(color.value);
    color.set(temp);
})

const block = html({
    styles: {
        padding: '32px',
    },
});

document.querySelectorAll('code.language-js').forEach((code: HTMLElement) => {
    (window as any).parent = block.mount(code.parentElement);
    eval(code.innerText);
    highlight.highlightBlock(code);
});
