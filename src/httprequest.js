const request = require('request');

class HttpRequest {

    static request(requestOptions) {
        return new Promise((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    console.error(error);
                    reject(error);
                } else if ('statusCode' in response) {
                    resolve(response);
                } else {
                    reject('Unexpected response : ' + JSON.stringify(response));
                }
            });
        });
    }
}

module.exports = HttpRequest;