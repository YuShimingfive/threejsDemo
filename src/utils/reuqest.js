export function getFileBlobUrl(url) {
    return new Promise(async function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.responseType = 'arraybuffer';
        request.open('get', url, true);
        request.onloadend = async (e) => {
            var file = request.response
            var blob = new Blob([file])
            resolve(window.URL.createObjectURL(blob))
        }
        request.send(null)
    })
}