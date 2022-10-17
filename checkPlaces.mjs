import fetch from "node-fetch";
import clipboard from 'clipboardy';

const API_URL = 'https://candidat.permisdeconduire.gouv.fr/api/v1/';
const URI_DEPARTMENTS = 'referentiels/departements-actifs';
const URI_CRENAUX = "candidat/creneaux?code-departement=";

const SLEEP = 500;
const SLEEP_TIMEOUT = 200;

let cookie = null;

function getCookieFromClipboard() {
    let cookie = clipboard.readSync();
    if (!cookie.startsWith('mod_auth')) {
        throw 'invalid cookie: make sure you have the cookie in the clipboard';
    }
    return cookie;
}

async function checkPlaces(args) {
    cookie = getCookieFromClipboard();

    let departments = [];
    await getDepartments().then(data => {
        if (data?.message) {
            throw data.message;
        }
        departments = [
            data.find(d => d.prefixe === '75'),
            ...data.reverse().filter(d => d.prefixe !== '75')
        ];
    }).catch(e => console.log('Error', e));

    if (args.length > 0) {
        departments = departments.filter(department => args.includes(department.prefixe));
    }

    let stop = false;
    let sleepMultiplicator = 0;
    for (let i = 0; i < departments.length; i++) {
        let department = departments[i];
        await getCrenaux(department.code)
            .then(data => handleCrenauxResponse(department, data))
            .catch(e => {
                if (e === 'timeout') {
                    sleepMultiplicator++;
                    console.log('server throttling detected, retrying..');
                    i--;
                    return;
                }
                console.log('Error', e);
                stop = true;
            });

        if (stop) {
            break;
        }

        await msleep(SLEEP + sleepMultiplicator * SLEEP_TIMEOUT);
    }
}

function handleCrenauxResponse(department, data) {
    if (data.message === 'Too many requests!') {
        throw 'timeout';
    }
    console.log(department.code, department.nom, data);
}

function getCrenaux(department) {
    return request(`${API_URL}${URI_CRENAUX}${department}`);
}

function getDepartments() {
    return request(`${API_URL}${URI_DEPARTMENTS}`);
}

function handle401(response) {
    if (response.status === 401) {
        throw '401 Unauthorized: cookie expired';
    }
    return response
}

async function request(url) {
    return fetch(url, {
        headers: {
            Cookie: cookie
        }
    })
    .then(response => handle401(response))
    .then(response => response.json());
}

async function msleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function main() {
    const args = process.argv.slice(2, process.argv.length);
    checkPlaces(args).catch(e => console.log('Exception', e));
}
main();