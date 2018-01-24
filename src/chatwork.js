const httprequest = require('./httprequest');

ChatworkApiURL = 'https://api.chatwork.com/v2';

class Chatwork {
    static async sendMessage(tokenId, roomId, message) {
        const options = {
            url: `${ChatworkApiURL}/rooms/${roomId}/messages`,
            method: 'POST',
            headers: {
                'X-ChatWorkToken': tokenId
            },
            form: { body: message },
            json: true
        };

        try {
            const resp = await httprequest.request(options);
            return resp;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Chatwork