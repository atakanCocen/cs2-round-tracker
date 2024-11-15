const jwt = require('jsonwebtoken');


function verifyToken(token, key) {

    try {
        let verified = false;
        console.log('verifying token...');
        jwt.verify(token, key, (err) => {
            if (err) {
                console.log('error attempting to verify token');
            }
            else {
                console.log('token verified');
                verified = true;
            }
        });

        return verified;
    } catch (error) {
        console.log('caught error: ' + error);
        return false;
    }
 };

 function getDecodedToken(token) {
    let decodedToken = jwt.decode(token);
    return decodedToken;
 }

module.exports = {verifyToken, getDecodedToken};