import crypto from "crypto-js";

function toHex(value: number) {
    return value.toString(16);
}

class Block {
    transactions: string[];
    nonce: number;
    previousBlockHash: string | null;
    timestamp: number;
    constructor(
        transactions: string[],
        nonce: number,
        previousBlockHash: string | null
    ) {
        this.transactions = transactions;
        this.nonce = nonce;
        this.previousBlockHash = previousBlockHash;
        this.timestamp = Date.now();
    }

    getMerkle(): string {
        return crypto.SHA256(String(this.transactions)).toString();
    }

    getHash(): string {
        return crypto
            .SHA256(
                "01000000" +
                    this.previousBlockHash +
                    this.getMerkle() +
                    toHex(this.timestamp) +
                    toHex(this.nonce)
            )
            .toString();
    }
}

class Blockchain {
    blocks: Block[];
    constructor(genesisBlock: Block) {
        this.blocks = [];
        this.blocks.push(genesisBlock);
    }

    mineNewBlock(transactions: string[]) {
        let nonce = Math.floor(Math.random() * 1000) + 1;
        let block = new Block(
            transactions,
            nonce,
            this.getLastBlock().getHash()
        );
        this.blocks.push(block);
    }

    getLastBlock(): Block {
        return this.blocks.at(-1);
    }

    getPreviousBlockFrom(currentBlock: Block): Block | void {
        if (currentBlock.previousBlockHash) {
            return this.blocks.find(
                (el) => el.getHash() === currentBlock.previousBlockHash
            );
        }
    }
}

function genTransactions(): string[] {
    let nbTx = Math.floor(Math.random() * 10);
    let transactions = new Array<string>(nbTx);
    for (let i = 0; i < nbTx; i++) {
        let n = Math.floor(Math.random() * 1000000000 + 1);
        transactions[i] = crypto.SHA256(String(n)).toString();
    }
    return transactions;
}

let genesisBlock = new Block([crypto.SHA256("genesis").toString()], 1, null);
let blockchain = new Blockchain(genesisBlock);

function getBlockchain() {
    for (let i = 0; i < 10; i++) {
        console.log(
            "-------------------------------------------------------------------"
        );
        console.log("current hash ---> ", blockchain.getLastBlock().getHash());
        blockchain.mineNewBlock(genTransactions());
        console.log(blockchain.getPreviousBlockFrom(blockchain.getLastBlock()));
        console.log(
            "-------------------------------------------------------------------"
        );
    }
}

console.log("ENTER");
getBlockchain();
console.log("EXIT");
