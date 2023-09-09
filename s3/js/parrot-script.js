function goParrot() {
    window.location = "/parrotLibrary.html";
}

window.onload = function () {
        readJsonFile("https://yahor-hlushak-s3-app-replica.s3.amazonaws.com/quotes.json", function (QuoteJson) {
            let QuoteObj = JSON.parse(QuoteJson);
            document.getElementById("Quote").innerHTML =
                "<i>" + QuoteObj.message + "</i>"
        });
    }

    function readJsonFile(file, callback) {
        let rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status === 200) {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
}
