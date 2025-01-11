const blockchainService = require("../Services/blockchain.Service");
const blockService = require("../Services/block.Service");

const myBlockchain = new blockchainService();

class blockchainController {
    home(req, res) {
        res.json(myBlockchain.chain);
    }

    addBlock(req, res) {
        const { data } = req.body;
        const dataBlock = {
            index: myBlockchain.chain.length,
            timestamp: Date.now(),
            data,
            previousHash: myBlockchain.getLatestBlock().hash,
        };
        const newBlock = new blockService(dataBlock);

        myBlockchain.addBlock(newBlock);
        res.json({ message: "Block added successfully!", chain: myBlockchain.chain });
    }

    validate(req, res) {
        const isValid = myBlockchain.isChainValid();
        res.json({ valid: isValid });
    }
}
module.exports = new blockchainController();