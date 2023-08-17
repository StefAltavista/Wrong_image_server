const fetchArchive = () => {
    let url =
        "https://archive.org/advancedsearch.php?q=chicken&fl%5B%5D=identifier&sort%5B%5D=&sort%5B%5D=&sort%5B%5D=&rows=500&page=2&output=json&save=no";

    fetch(url)
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .then((x) => {
            console.log(x.response.docs);
            let identifiers = [...x.response.docs];
            // identifiers.map(({identifier}) => {
            //     console.log(identifier);
            // });

            fetch(
                `http://archive.org/metadata/${identifiers[100].identifier}/files`,
                {
                    authorization: {
                        "5N9HX267Woe2vnAz": "V96weRxamE5aUIuS",
                    },
                }
            )
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    console.log(`identifier:${identifiers[100].identifier}\n`);
                    console.log("response:", response);
                    let images = response.result.filter((x) =>
                        x.name.endsWith("jpg")
                    );
                    console.log("images found:", images[0].name);
                    // var pages = response.query.pages;
                    // for (var page in pages) {
                    //     for (var img of pages[page].images) {
                    //         console.log(img.title);
                    //     }
                    // }
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
};
