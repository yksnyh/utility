import test from 'ava'
import Chatwork from '../src/chatwork'

test('sendMessage', async t => {
    const tokenId = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    const roomId = 'XXXXXXXXXX'
    const resp = await Chatwork.sendMessage(tokenId, roomId, 'test1 title\nテストメッセージ1');

    t.is(resp.statusCode, 200)
})