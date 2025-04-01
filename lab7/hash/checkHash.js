const bcrypt = require('bcrypt');
const fs = require('fs');
const HASH_FILE = 'password.txt';



async function main(){ 
    const input = process.argv[2];
    const savedhash = fs.readFileSync(HASH_FILE, 'utf8');

    const martch = await bcrypt.compare(input, savedhash);
    if (martch) {
        console.log('Match!');
    } else {
        console.log('No match!');
    }
};

main();