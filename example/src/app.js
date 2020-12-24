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

document.querySelector('h1').addEventListener('click', () => {
    const temp = background.value;
    background.set(color.value);
    color.set(temp);
})

const block = html({
    styles: {
        padding: '32px',
        backgroundColor: color,
        width: '40%',
        color: background,
        borderRadius: '4px',
    },
});

document.querySelectorAll('code.language-js').forEach(code => {
    const parent = window.parent = block.mount(code.parentElement);
    code.setAttribute('contenteditable', true);
    code.addEventListener('input', () => {
        parent.innerHTML = '';
        try {
            eval(code.innerText);
        } catch (e) {
            parent.innerHTML = e;
        }
    }, false);
    code.dispatchEvent(new Event('input'));
});
