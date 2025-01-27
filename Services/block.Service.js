const crypto = require('crypto'); 

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index; 
        this.timestamp = timestamp; 
        this.data = data; 
        this.previousHash = previousHash; 
        this.hash = this.calculateHash(); 
        this.nonce = 0; 
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce)
            .digest('hex');
    }

    mineBlock(difficulty) {
        while (!this.hash.startsWith(Array(difficulty + 1).join('0'))) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block mined: ${this.hash}`);
    }
}

module.exports = Block;
