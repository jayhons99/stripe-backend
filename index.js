// move secret key outside of code later

const stripe = require('stripe')('sk_test_51NMFCRLG1gYd6OyKQOkLtOrI0WbIGJ8Ngtw5op0yZ6faHll3arCGcBsaXGVwf6d3hljaOU4ZxrTyMu9iGusuEVWw00At14bNro');


exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
    }
    if (event.body) {
        const { cart, totalAmount, shippingFees } = JSON.parse(event.body);
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalAmount,
                currency: 'usd',
                automatic_payment_methods: {
                    enabled: true
                }
            })
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(paymentIntent.client_secret),
            }
        } catch (err) {
            return {
                statusCode: 502,
                headers,
                body: JSON.stringify("Server error, please check Stripe integration."),
            }
        }
    }
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify('Payment intent created')
    }
}