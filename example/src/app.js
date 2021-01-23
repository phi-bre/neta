import { html, styles, state, global } from '../../src';
import readme from '../../README.md';
import {mount} from '../../src/core';

window.html = html;
window.state = state;
window.styles = styles;

const dark = state(false);
const background = dark.then(dark => dark ? '#242628' : '#f5f5f5');
const shade = dark.then(dark => dark ? '#292d2e' : '#fff');
const color = dark.then(dark => dark ? '#f5f5f5' : '#242628');

global({
    '*': {
        transition: 'background-color 0.2s, color 0.1s',
    },
    'body': {
        backgroundColor: background,
        color: color,
    },
    'code': {
        backgroundColor: shade,
        color: color,
    },
    'pre code': {
        backgroundColor: '#292d2e',
        color: '#e5e5e5',
    },
});

const app = html({
    document,
    styles: {
        fontFamily: '"Montserrat", sans-serif',
        maxWidth: '1000px',
        marginRight: 'auto',
        marginLeft: 'auto',
        padding: '48px',
    },
    html: readme,
});

mount(app);

document.querySelector('h1')?.addEventListener('click', () => {
    dark.set(!dark.value);
})

const block = html({
    styles: {
        padding: '32px',
        width: '40%',
        borderRadius: '4px',
        backgroundColor: 'white',
        color: 'initial',
    },
});

document.querySelectorAll('code.language-js').forEach(code => {
    const parent = window.parent = block.mount(code.parentElement);
    code.setAttribute('contenteditable', true);
    code.addEventListener('input', () => {
        parent.innerHTML = '';
        try {
            eval(code.innerText);
            // highlight.highlightBlock(code);
        } catch (e) {
            parent.innerHTML = e;
        }
    }, false);
    code.dispatchEvent(new Event('input'));
});

document.querySelectorAll('[id]').forEach(heading => {
    heading.addEventListener('click', () => {
        location.hash = heading.id;
        navigator.clipboard.writeText(location);
    });
});
