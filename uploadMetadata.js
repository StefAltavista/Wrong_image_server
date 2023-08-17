// const NFTPORT = require("../config.json");

let NFTPORT;

if (process.env.NODE_ENV == "production") {
    NFTPORT = process.env.SESSION_SECRET;
} else {
    NFTPORT = require("../config.json");
}
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
module.exports.uploadMetadata = (metadata) => {
    const url = "https://api.nftport.xyz/v0/metadata ";
    const options = {
        headers: {
            Authorization: NFTPORT.NFT_PORT_KEY,
            "Content-type": "application/json",
        },
        method: "POST",
        body: metadata,
    };
    return fetch(url, options)
        .then((res) => res.json())
        .then((response) => response);
};
