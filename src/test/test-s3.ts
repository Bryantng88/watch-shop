// test-s3.ts
fetch("https://longnd.myqnapcloud.com:8010")
    .then((r) => {
        console.log("OK", r.status);
    })
    .catch((e) => {
        console.error(e);
    });