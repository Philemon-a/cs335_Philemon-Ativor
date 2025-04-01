const crypto = require('crypto');
const fs = require('fs');


const RSA_PRIVATE_KEY_FILE = 'private.pem';
const RSA_PUBLIC_KEY_FILE = 'public.pem';

function generateAndSaveRSAKeys(){
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });

    fs.writeFileSync(RSA_PRIVATE_KEY_FILE, privateKey);
    console.log('Private key saved to private.pem :', `${RSA_PRIVATE_KEY_FILE}`);
    fs.writeFileSync(RSA_PUBLIC_KEY_FILE, publicKey);
    console.log('Public key saved to public.pem:', `${RSA_PUBLIC_KEY_FILE}`);
};

generateAndSaveRSAKeys();
