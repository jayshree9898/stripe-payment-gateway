const router = require('express').Router();


const paymentController = require('../controller/payment.controller');

router.post('/create-account', paymentController.createAccount);

router.post('/add-payment-card', paymentController.paymentCard);

router.post('/list-payment-method', paymentController.listPaymentMethods);

router.post('/update-prefer-method', paymentController.updatePreferPaymentMethod)

router.delete('/remove-payment-method', paymentController.removePaymentMethod);

router.post('/payment', paymentController.makePayment);

router.post('/refund', paymentController.refund);
module.exports = router