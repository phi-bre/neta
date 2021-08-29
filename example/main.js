import * as neta from '../src';

window.neta = neta;

const $dark = neta.state(true);
const $theme = $dark.then(dark => dark ? {
    primary: '#eee',
    secondary: '#111',
} : {
    primary: '#eee',
    secondary: '#111',
});
const $time = neta.state(new Date());


neta.state($time, $dark)
    .then((time, dark) => console.log(time, dark));

setInterval(() => {
    $time.set(new Date());
}, 1000);

const div = neta.styled({
    styles: {
        // backgroundColor: $dark.then(dark => dark ? 'white' : 'black'),
        // color: $dark.then(dark => dark ? 'black' : 'white'),
    },
    text: 'Hello!',
});

const centered = neta.styled({
    neta: 'centered',
    styles: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

function slider(max, $index) {
    const size = 40;
    return centered({
        styles: {
            transition: 'margin-top 0.2s',
            margin: 'auto 2px',
            marginTop: $index.then(index => -index * size + 'px'),
        },
        children: [
            new Array(max).fill(0).map((_, i) => {
                const $selected = $index.then(index => index === i);
                return centered({
                    styles: {
                        // transition: 'background-color 0.1s',
                        // backgroundColor: neta.derive($selected, $theme)
                        //     .then(([selected, theme]) => selected ? theme.primary : theme.secondary),
                        // color: neta.derive($selected, $theme)
                        //     .then(([selected, theme]) => selected ? theme.primary : theme.secondary),
                        borderRadius: `${size}px`,
                        lineHeight: `${size}px`,
                        fontWeight: 'bold',
                        width: `${size}px`,
                        height: `${size}px`,
                    },
                    text: String(i),
                });
            }),
        ],
    });
}

neta.document({
    title: 'Clockinator',
    head: neta.stylesheet({
        styles: {
            '*': {
                // 'background-color': 'black',
                // ':hover': {
                    // 'background-color': 'white',
                // },
            },
        },
    }),
    body: centered({
        attributes: {
            onclick() {
                $dark.set(!$dark.value);
            },
        },
        styles: {
            fontFamily: '"Montserrat", sans-serif',
            maxWidth: '1000px',
            marginRight: 'auto',
            marginLeft: 'auto',
            padding: '48px',
            color: '#000',
            height: '100vh',
        },
        children: [
            neta.styled({
                styles: {
                    display: 'flex',
                    alignItems: 'start',
                    marginTop: '50%',
                },
                children: [
                    div
                    // slider(3, $time.then(time => Number(time.getHours().toString()[0] || '0'))),
                    // slider(10, $time.then(time => Number(time.getHours().toString()[1] || '0'))),
                    // slider(6, $time.then(time => Number(time.getMinutes().toString()[0] || '0'))),
                    // slider(10, $time.then(time => Number(time.getMinutes().toString()[1] || '0'))),
                    // slider(6, $time.then(time => Number(time.getSeconds().toString()[0] || '0'))),
                    // slider(10, $time.then(time => Number(time.getSeconds().toString()[1] || '0'))),
                ],
            }),
            // time.then(time => time.toLocaleTimeString()),
        ],
    }),
});

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
