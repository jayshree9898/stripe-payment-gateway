const MESSAGES = {
    //auth controller
    '1001': 'Signup successfully!',
    '1002': 'Login successfully!',
    '1003': 'email already exists',
    '1004': 'User not found!',
    '1005': 'Incorrect password',
    '1006': 'Email already exist.',
    '1007': 'customer get successfully.',
    '1008': 'token not create',




    '9999': 'Something want wrong.',

}

module.exports.getMessage = function (messageCode) {
    if (isNaN(messageCode)) {
        return messageCode;
    }
    return messageCode ? MESSAGES[messageCode] : '';
};