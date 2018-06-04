/*
 author: wangx
 time: 2018/6/4
 description：implement block chain by javascript.
 */

// 从类库crypto-js中引入sha256
const SHA256 = require("sha256");
/*
 description: 区块类
 params: block_id 区块编号
 params: timestamp 时间戳
 params: data 区块数据
 params: previousHash 前一区块的hash值
 params: hash 当前区块hash值
 */

class Block {
	// 构造器
	constructor(block_id, timestamp,data,previousHash = '') {
		this.block_id = block_id;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
	}

	/*
	 description: 计算当前区块hash值
	 */
	calculateHash() {
		return SHA256(this.block_id + this.previousHash + this.timestamp
			+ JSON.stringify(this.data)).toString();
	}
}

/*
 description: 区块链类
 params: chain 区块链链表
 */
class BlockChain {

	constructor(){
		this.chain = [this.createGenesisBlock()];
	}

	// 创造一个创始区块
	createGenesisBlock(){
		return new Block(0,"04/06/2018","Genesis block","0");
	}

	// 取到上一个区块
	getLastBlock(){
		return this.chain[ this.chain.length - 1 ];
	}

	// 将新的区块添加到区块链上
	addBlock(newBlock){
		newBlock.previousHash = this.getLastBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}

	/*
	 * description: 检验区块链，确保没有人篡改，
 	 * 遍历链表，判断当前区块的previousHash是否等于上一区块的hash值
	 * params: currentBlock 当前区块
	 * params: previousBlock 上一区块
	 */
	isChainValid(){
		for(let i = 1; i < this.chain.length ; i++){
			currentBlock = this.chain[i];
			previousBlock = this.chain[i-1];

			// 当前区块的hash值不一致
			if(currentBlock.hash !== currentBlock.calculateHash()){
				return false;
			}

			// 上一区块hash值不等于当前区块的previousHash
			if(currentBlock.previousHash !== previousBlock.hash){
				return false;
			}
		}
		return true;
	}
}

	let jsCoin = new BlockChain();
	jsCoin.addBlock(new Block(1,"04/06/2018",{ name : "wangx" }));
	jsCoin.addBlock(new Block(2,"05/06/2018",{ name : "chenh" }));

	console.log(jsCoin);
