const crypto = require('crypto');
const fs = require('fs');


const SYMMETRIC_ALGORITHM = 'aes-128-ctr';
const SYM_KEY_LENGTH = 16;
const ASYM_HASH= 'sha256';
const ASYM_PAD = crypto.constants.RSA_PKCS1_OAEP_PADDING;

const PUBLIC_KEY_FILE = 'public.pem';
const PUBLIC_KEY = fs.readFileSync(PUBLIC_KEY_FILE);




function encrypt(text, key, iv){ //symetric encryption
    let cipher = crypto.createCipheriv(SYMMETRIC_ALGORITHM, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');

}

function encryptPub(text,publicKey){ //asymetric encryption
    const encryptedBuffer = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: ASYM_PAD,
            oaepHash: ASYM_HASH
        },
        Buffer.from(text)
    );
    return encryptedBuffer.toString('hex');
}

const ekey = crypto.randomBytes(SYM_KEY_LENGTH);
const eiv = crypto.randomBytes(16);

let eKey = encryptPub(ekey, PUBLIC_KEY);
let eIv = encryptPub(eiv, PUBLIC_KEY);

let phrases =[
    'Hello, World!',
    'Goodbye, World!',
    'I am a fish.',
    'I am a fish, too.'
]

let encryptedTxt = phrases.map(m =>encrypt(m, ekey, eiv));

const doc = {
    key: eKey,
    iv: eIv,
    data: encryptedTxt
}

fs.writeFileSync('encryptedMessages.json', JSON.stringify(encryptedTxt, null, 2));