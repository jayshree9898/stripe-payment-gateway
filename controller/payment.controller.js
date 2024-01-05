const Validator = require('validatorjs');
const config = require('../config/config');
const db = require('../config/db.config');
const stripe = require('stripe')(config.stripe_key.privatekey);


const createAccount = async (req, res) => {
    let validation = new Validator(req.query, {
        email: 'required',
        name: 'required'
    })
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(validation.errors.first(firstMessage));
    }
    try {
        const { email, name } = req.query;
        const customer = await stripe.customers.create({
            name: name,
            email: email,
        });

        return RESPONSE.success(res, 'add customer successfully', customer)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


const paymentCard = async (req, res) => {
    let validation = new Validator(req.query, {
        customer_id: 'required',
        card_number: 'required',
        exp_month: 'required',
        exp_year: 'required',
        cvc: 'required'
    });

    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage));
    }

    try {
        const { card_number, exp_month, exp_year, cvc, customer_id } = req.query;

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: card_number,
                exp_month: exp_month,
                exp_year: exp_year,
                cvc: cvc,
            },
        });

        await stripe.paymentMethods.attach(
            paymentMethod.id,
            { customer: customer_id }
        );

        return RESPONSE.success(res, 'add payment card successfully', paymentMethod);
    } catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999);
    }
};


//...............list payment methods...........
const listPaymentMethods = async (req, res) => {
    let validation = new Validator(req.query, {
        customer_id: 'required',


    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage));
    }
    try {
        const { customer_id } = req.query;

          
        const paymentMethods = await stripe.customers.listPaymentMethods(
            customer_id,
            { type: 'card' }
        );

        return RESPONSE.success(res, 'get payment method successfully', paymentMethods);
    } catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999);
    }



}


//................update prefer payment method .........
const updatePreferPaymentMethod = async (req, res) => {
    let validation = new Validator(req.query, {
        customer_id: 'required',
        paymentMethod_id: 'required'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage));
    }
    try {
        const { customer_id, paymentMethod_id } = req.query;

        const updatePaymentMethod = await stripe.customers.update(
            customer_id,
            {
                invoice_settings: {
                    default_payment_method: paymentMethod_id
                }
            }
        );

        return RESPONSE.success(res, 'Payment method update successfully', updatePaymentMethod);
    } catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999);
    }
}

//.............update payment method......................
const removePaymentMethod = async (req, res) => {
    let validation = new Validator(req.body, {
        paymentMethod_id: 'required'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage));
    }
    try {
        const { paymentMethod_id } = req.body;

        await stripe.paymentMethods.detach(
            paymentMethod_id
        );

        return RESPONSE.success(res, 'Payment method remove successfully');
    } catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999);
    }
}


//...............make payment ............
const makePayment = async (req, res) => {
    let validation = new Validator(req.body, {
        amount: 'required',
        customer_id: 'required',
        payment_method_id: 'required'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage));
    }
    try {
        const { amount, customer_id, payment_method_id } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseFloat(amount).toFixed(2) * 100,
            currency: 'usd',
            payment_method_types: ['card'],
            confirm: true,
            customer: customer_id,
            payment_method: payment_method_id

        });
        return RESPONSE.success(res, 'Payment success.', paymentIntent);
    } catch (error) {
        console.error(error);
        return RESPONSE.error(res, error.message);
    }
}


//.......refund
const refund = async (req, res) => {
    let validation = new Validator(req.body, {
        payment_intent_id: 'required',
        amount: 'required'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage));
    }
    try {
        const { payment_intent_id, amount } = req.body;

        // const refundData = await stripe.refunds.create({
        //     payment_intent: payment_intent_id,
        //     amount: amount * 100
        // })

        //payment cancel
        const paymentIntent = await stripe.paymentIntents.cancel(payment_intent_id);

        return RESPONSE.success(res, 'amount refunded successfully.', paymentIntent);
    } catch (error) {
        console.error(error);
        return RESPONSE.error(res, error.message);
    }
}



module.exports = {
    createAccount,
    paymentCard,
    listPaymentMethods,
    updatePreferPaymentMethod,
    removePaymentMethod,
    makePayment,
    refund
}