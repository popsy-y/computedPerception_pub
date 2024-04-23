import Timeout from 'await-timeout';

const awtimer = new Timeout();

const primary = new Promise((resolve, reject) => setTimeout(resolve, 100, 'primaryValue'));
const secondary = new Promise((resolve, reject) => setTimeout(resolve, 100, 'secondaryValue'));

Promise.race([primary, secondary])
    .then((value) => console.log(value));

async function main(){try {
} finally {
    console.log('finally');
}};


function test() {
    setTimeout(() => {
        console.log('hi');
        return false;
    }, 2000);
}