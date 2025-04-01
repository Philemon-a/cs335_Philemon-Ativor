const crypto = require('crypto');
const fs = require('fs');


const PRIVATE_KEY_FILE= 'private.pem';
const PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_FILE);

const SYMMETRIC_ALGORITHM = 'aes-128-ctr';
const ASYM_HASH = 'sha256';
const ASYM_PAD = crypto.constants.RSA_PKCS1_OAEP_PADDING;

function decrypt(text, key, iv){
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv(SYMMETRIC_ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

function decryptedPriv(encryptedHex, privateKey){
    const decryptedBuffer = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: ASYM_PAD,
            oaepHash: ASYM_HASH
        },
        Buffer.from(encryptedHex, 'hex', 'utf8')
    );
    return decryptedBuffer;
}

const messageFile = 'encryptedMessages.json';
const doc = JSON.parse(fs.readFileSync(messageFile));

let  key = decryptedPriv(doc.key, PRIVATE_KEY);
let  iv = decryptedPriv(doc.iv, PRIVATE_KEY);

console.log('Decrypted messages:');
for (let txt of doc.data){
    console.log(decrypt(txt, key, iv));
}
