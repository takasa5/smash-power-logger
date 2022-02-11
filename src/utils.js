const urljoin = require("url-join");

async function get(endpoint) {
    const res = await fetch(urljoin(process.env.API, endpoint),  {
        method: 'GET'
    })
    const json = await res.json();
    return json;
}

export {get}