const Validator = require('validatorjs');
const db = require('../config/db.config');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const stripe = require('stripe')(config.stripe_key.privatekey)
const User = db.users;
const UserSession = db.userSession;


//................create stripe user..................
const createUser = async (req, res) => {
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



//......................payment...
const payment = async (req, res) => {
    let validation = new Validator(req.query, {
        email: 'required',
        name: 'required'
    });

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

        if (customer) {
            const payment = await stripe.paymentIntents.create({
                customer: customer.id,
                amount: 7000,
                description: 'Stripe transaction',
                currency: 'usd',
            });

            const data = { customer, payment }
            return RESPONSE.success(res, 'add customer successfully', data);
        }
    } catch (error) {
        console.error(error);
        return RESPONSE.error(res, 9999);
    }
};



const addCard = async (req, res) => {
    let validation = new Validator(req.query, {
        customer_id: 'required',
        card_Name: 'required',
        card_ExpYear: 'required',
        card_ExpMonth: 'required',
        card_CVC: 'required',
    })
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(validation.errors.first(firstMessage));
    }
    try {
        const { customer_id, card_Name, card_ExpYear, card_ExpMonth, card_CVC } = req.query;

        const card_token = 'tok_visa';

        const card = await stripe.customers.createSource(customer_id, {
            source: card_token
        });
        return RESPONSE.success(res, 'add Card successfully', card.id)

    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


//..........get customer ...........
const retrieveCustomer = async (req, res) => {
    let validation = new Validator(req.query, {
        customer_id: 'required',
    })
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(validation.errors.first(firstMessage));
    }
    try {
        const { customer_id } = req.query;

        const customer = await stripe.customers.retrieve(customer_id);

        if (!customer) {
            return RESPONSE.error(res, 1007)
        }

        return RESPONSE.success(res, "get customer successfully...", customer)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, error.message)
    }
}



//............get all customer
const getCustomer = async (req, res) => {
    try {
        const customer = await stripe.customers.list({ limit: 4 });

        if (!customer) {
            return RESPONSE.error(res, 1007)
        }

        return RESPONSE.success(res, 1011, customer)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, error.message)
    }
}


//.................create token ...........
var createToken = function () {

    var param = {};
    param.card = {
        number: '4242 4242 4242 4242',
        exp_month: 2,
        exp_year: 2024,
        cvc: '212'
    }

    stripe.tokens.create(param, function (err, token) {
        if (err) {
            console.log("err: " + err);
        } else if (token) {
            console.log("success: " + JSON.stringify(token, null, 2));
        } else {
            console.log("Something wrong")
        }
    })
}
createToken();

module.exports = {
    payment,
    createUser,
    addCard,
    retrieveCustomer,
    getCustomer
    // createToken

    //     signUp,
    //     login
}