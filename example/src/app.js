import highlight from 'highlight.js';
import { global, html, state } from 'neta/src';
import readme from 'neta/README.md';

window.html = html;
window.state = state;

const background = state('#242628');
const color = state('#fff');

global({
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

window.addEventListener('click', () => {
    const temp = background.value;
    background.set(color.value);
    color.set(temp);
})

const block = html({
    styles: {
        padding: '32px',
    },
});

document.querySelectorAll('code.language-js').forEach(code => {
    window.parent = block.mount(code.parentElement);
    eval(code.innerText);
    highlight.highlightBlock(code);
});
