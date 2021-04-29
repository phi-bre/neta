// import readme from '../README.md?raw';
import * as neta from '../src';

window.neta = neta;
document.body.innerText = 'Temporarily unavailable';

// const dark = neta.state(false);
// const background = dark.then(dark => dark ? '#242628' : '#f5f5f5');
// const shade = dark.then(dark => dark ? '#292d2e' : '#fff');
// const color = dark.then(dark => dark ? '#f5f5f5' : '#242628');
// const text = readme
//     .replace(/^### (.*$)/gim, '<h3>$1</h3>')
//     .replace(/^## (.*$)/gim, '<h2>$1</h2>')
//     .replace(/^# (.*$)/gim, '<h1>$1</h1>')
//     .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
//     .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
//     .replace(/\*(.*)\*/gim, '<i>$1</i>')
//     .replace(/!\[(.*?)]\((.*?)\)/gim, '<img alt="$1" src="$2">')
//     .replace(/\[(.*?)]\((.*?)\)/gim, '<a href="$2">$1</a>')
//     .replace(/```(.*?) (.*?)```/gim, '<pre><code lang="$1">$2</code></pre>')
//     .replace(/`(.*?)`/gim, '<code>$1</code>')
//     .replace(/\n$/gim, '<br/>');
//
// function markdown({ source, rules }) {
//     const blocks = [];
//     rules.forEach(rule => {
//         source.replace()
//     });
//     return neta.element({
//         children: ,
//     });
// }
//
// function rule({ pattern, element }) {
//     return { pattern, element };
// }
//
// neta.document({
//     body: neta.element({
//         styles: {
//             fontFamily: '"Montserrat", sans-serif',
//             maxWidth: '1000px',
//             marginRight: 'auto',
//             marginLeft: 'auto',
//             padding: '48px',
//             color: color,
//         },
//         html: text,
//     }),
// });
//
// document.querySelector('h1')?.addEventListener('click', () => {
//     dark.set(!dark.value);
// });
//
// const block = neta.element({
//     styles: {
//         padding: '32px',
//         width: '40%',
//         borderRadius: '4px',
//         backgroundColor: 'white',
//         color: 'initial',
//     },
// });
//
// document.querySelectorAll('code.language-js').forEach(code => {
//     // const parent = window.parent = block.mount(code.parentElement);
//     // code.setAttribute('contenteditable', true);
//     // code.addEventListener('input', () => {
//     //     parent.innerHTML = '';
//     //     try {
//     //         eval(code.innerText);
//     //         // highlight.highlightBlock(code);
//     //     } catch (e) {
//     //         parent.innerHTML = e;
//     //     }
//     // }, false);
//     // code.dispatchEvent(new Event('input'));
// });
//
// document.querySelectorAll('[id]').forEach(heading => {
//     heading.addEventListener('click', () => {
//         location.hash = heading.id;
//         navigator.clipboard.writeText(location);
//     });
// });
