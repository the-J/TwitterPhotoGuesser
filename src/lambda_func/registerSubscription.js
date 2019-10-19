const TwitterController = require('../TwitterController')

module.exports.handler = async () => {
    const controller = new TwitterController(
        process.env.TWITTER_CONSUMER_KEY,
        process.env.TWITTER_CONSUMER_SECRET,
        process.env.TWITTER_TOKEN,
        process.env.TWITTER_TOKEN_SECRET,
        process.env.URL_BASE,
        process.env.ENVIRONMENT,
        process.env.CRC_URL,
    )

    await controller.registerSubscription()
}
