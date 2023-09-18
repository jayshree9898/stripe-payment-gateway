const router = require('express').Router();


const userController = require('../controller/user.controller');


// router.post('/sign-up', userController.signUp);

// router.post('/login', userController.login)

router.post('/payment', userController.payment);
router.post('/create-user', userController.createUser);
router.post('/add-card', userController.addCard);
router.get('/retrieve-customer', userController.retrieveCustomer);
router.get('/get-all-customer', userController.getCustomer);
// router.post('/create-token', userController.createToken);

module.exports = router