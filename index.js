const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_TEST);

exports.handler = async (event) => {
    const statusCode = 200;
    const headers = {
        'Access-Control-Allow-Origin': '*',
    }
    if (event.body) {
        const { cart, totalAmount, shippingFees } = JSON.parse(event.body);

        return {
            statusCode,
            headers,
            body: JSON.stringify(cart),
        }
    }
    return {
        statusCode,
        headers,
        body: JSON.stringify('Payment intent created')
    }
}