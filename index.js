const AWS = require('aws-sdk');
const stripe = require('stripe');

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
    }

    try {
        const ssm = new AWS.SSM();
        const parameterName = process.env.STRIPE_SECRET_KEY_TEST;
        const parameterResult = await ssm.getParameter({
            Name: parameterName,
            WithDecryption: true,
        }).promise();

        const clientSecret = parameterResult.Parameter.Value;
        const stripeClient = stripe(`${clientSecret}`);
        if (event.body) {
            const { cart, totalAmount, shippingFees } = JSON.parse(event.body);
            const totalOrderAmount = totalAmount + shippingFees;
            try {
                const paymentIntent = await stripeClient.paymentIntents.create({
                    amount: totalOrderAmount,
                    currency: 'usd',
                    automatic_payment_methods: {
                        enabled: true,
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
                    body: JSON.stringify(`Error creating paymentIntent: ${err}`),
                }
            }
        }
    } catch (err) {
        return {
            statusCode: 502,
            headers,
            body: JSON.stringify(`Error retrieving parameter: ${err}`),
        }
    }
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify('Payment intent created')
    }
}