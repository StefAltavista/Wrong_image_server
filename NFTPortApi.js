// const NFTPORT = require("../config.json");

let NFT_PORT_KEY;

if (process.env.NODE_ENV == "production") {
    NFT_PORT_KEY = process.env.NFT_PORT_KEY;
} else {
    NFT_PORT_KEY = require("../config.json").NFT_PORT_KEY;
}

const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

const getNfts = (req) => {
    let url;
    if (req.body.type == "created") {
        url = `https://api.nftport.xyz/v0/accounts/creators/${req.body.walletAddress}?chain=${req.body.chain}`;
    }
    if (req.body.type == "owned") {
        url = `https://api.nftport.xyz/v0/accounts/${req.body.walletAddress}?chain=${req.body.chain}`;
    }
    return fetch(url, {
        headers: {
            Authorization: NFT_PORT_KEY,
            "Content-Type": "application/json",
        },
        method: "GET",
    })
        .then((result) => result.json())
        .then(async (arr) => {
            if (arr && arr.nfts[0]) {
                let promises = arr.nfts.map((x, idx) => {
                    return new Promise((resolve, rej) => {
                        setTimeout(() => {
                            url = `https://api.nftport.xyz/v0/nfts/${x.contract_address}/${x.token_id}?chain=${req.body.chain}`;
                            console.log(url);
                            fetch(url, {
                                headers: {
                                    Authorization: NFT_PORT_KEY,
                                    "Content-Type": "application/json",
                                },
                                method: "GET",
                            })
                                .then((res) => res.json())
                                .then((response) => resolve(response));
                        }, idx * 400);
                    });
                });
                console.log(promises);

                let nfts = await Promise.all(promises);
                console.log("from method nfts:", nfts.length);
                nfts.map((x) => console.log(x.nft.metadata.name));
                return nfts;
            } else return null;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};

const mintNft = async (req) => {
    const { contractAddress, contractChain, walletAddress, metadata_url } =
        req.body;
    console.log(contractAddress, contractChain, walletAddress, metadata_url);

    const url = "https://api.nftport.xyz/v0/mints/customizable";

    const options = {
        headers: {
            Authorization: NFTPORT.NFT_PORT_KEY,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            chain: contractChain,
            contract_address: contractAddress,
            metadata_uri: metadata_url,
            mint_to_address: walletAddress,
        }),
    };
    const response = await fetch(url, options).then((res) => res.json());
    console.log("response in method nftport:", response);
    return response;
};

module.exports = {
    getNfts,
    mintNft,
};
