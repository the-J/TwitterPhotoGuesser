const request = require('request-promise')

module.exports = class TwitterController {
    constructor( consumerKey, consumerSecret, token, tokenSecret, urlBase, environment, crcUrl ) {

        this.consumerKey = consumerKey
        this.consumerSecret = consumerSecret
        this.token = token
        this.tokenSecret = tokenSecret
        this.urlBase = urlBase
        this.environment = environment
        this.crcUrl = crcUrl

        this.credentials = {
            consumerKey: this.consumerKey,
            consumerSecret: this.consumerSecret,
            token: this.token,
            token_secret: this.tokenSecret
        }

        this.registerWebhook = this.registerWebhook.bind(this)
    }

    setRequestOptions( type, webhookId ) {
        const { urlBase, environment, credentials, crcUrl } = this
        let url = null, content = {}

        switch (type) {
        case('registerWebhook'):
            url = `${urlBase}${environment}/webhooks.json`
            content = { form: { url: crcUrl } }
            break
        case ('getWebhook'):
            url = `${urlBase}${environment}/webhooks.json`
            break
        case ('deleteWebhook'):
            url = `${urlBase}${environment}/webhooks/${webhookId}.json`
            break
        case ('registerSubscription'):
            url = `${urlBase}${environment}/subscriptions.json`
            break
        case ('createTweet'):
            url = `${urlBase}update.json`
            break
        default:
            url = `${urlBase}${environment}/webhooks.json`
        }

        return Object.assign({}, {
            url,
            oauth: credentials,
            headers: {
                'Content-type': 'application/x-www-form-encoded'
            },
            resolveWithFullResponse: true
        }, content)
    }

    async registerWebhook() {
        const requestOptions = this.setRequestOptions('registerWebhook')

        try {
            const res = await request.post(requestOptions)
            if (res.statusCode === 204) console.info('Subscription added')
        } catch (err) {
            console.error('Cannon register subscription: ', err)
        }
    }

    async registerSubscription() {
        const requestOptions = this.setRequestOptions('registerSubscription')

        try {
            const res = await request.post(requestOptions)
            if (res.statusCode === 204) console.info('Subscription added. Yay!')
        } catch (err) {
            console.error('Cannot register subscription: ', err)
        }
    }

    async getWebhook() {
        const requestOptions = this.setRequestOptions('getWebhook')

        try {
            await request.get(requestOptions)
        } catch (err) {
            console.error('Cannot get webhook: ', err)
        }
    }

    async deleteWebhook() {
        const webhook = await this.getWebhook()
        const parsedWebhook = JSON.parse(webhook.body)
        const requestOptions = this.setRequestOptions('deleteWebhook', parsedWebhook[ 0 ].id)

        try {
            await request.delete(requestOptions)
            console.info(`Deleted webhook with id: ${parsedWebhook[ 0 ].id}`)
        } catch (err) {
            console.error('Cannot delete webhook: ', err)
        }
    }

    async createTweet( status, tweetID ) {
        const requestOptions = Object.assign({}, this.setRequestOptions('createTweet'), {
            form: {
                status,
                in_reply_to_status_id: tweetID,
                auto_populate_reply_metadata: true
            }
        })

        try {
            await request.post(requestOptions)
        } catch (err) {
            console.error('Cannot post tweet: ', err)
        }
    }
}
