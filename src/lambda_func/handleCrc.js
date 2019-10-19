const crypto = require('crypto')

const encodeCrc = ( crcToken, consumerSecret ) =>
    crypto
        .createHmac('sha256', consumerSecret)
        .update(crcToken)
        .digest('base64')

module.exports.handler = async ( event ) => {
    const responseToken = encodeCrc(
        event.queryStringParameters.crc_token,
        process.env.TWITTER_CONSUMER_SECRET
    )
    return {
        statusCode: 200,
        body: JSON.stringify({ response_token: `sha256=${responseToken}` })
    }
}
