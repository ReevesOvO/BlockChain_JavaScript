/*
 author: wangx
 time: 2018/6/4
 description：implement block chain by javascript.
 */

/*
 description: 区块类
 params: block_id 区块编号
 params: timestamp 时间戳
 params: data 区块数据
 params: previousHash 前一区块的hash值
 params: hash 当前区块hash值
 params: nouce 查找一个有效哈希需要的次数
 */

class Block {
	// 构造器
	constructor(block_id, timestamp,data,previousHash = '') {
		this.block_id = block_id;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nouce = 0;
	}

	/*
	 description: 计算当前区块hash值
	 */
	calculateHash() {
		// 使用类库crypto-js中的sha256加密算法
		return CryptoJS.SHA256(this.block_id + this.previousHash + this.timestamp
			+ JSON.stringify(this.data) + this.nouce).toString();
	}
	/*
	 * description: 如果计算得到的hash不是以 difcult个0开头的hash就一直进行计算
	 * example: 002c7e2c59715aaa8bfa3881afde140b4515bbf9ea00b7008410cca03d1ac608
	 * params: diffcult 难度
	 */
	mineBlock(diffcult){
		while(this.hash.substring(0,diffcult) !== Array(diffcult + 1).join('0')){
			this.nouce ++;
			this.hash = this.calculateHash();
		}
		console.log("Block Mined:" + this.hash);
	}
}

/*
 description: 区块链类
 params: chain 区块链链表
 */
class BlockChain {

	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.diffcult = 2;
	}

	// 创造一个创始区块
	createGenesisBlock(){
		return new Block(0,"04/06/2018","first block","0");
	}

	// 取到上一个区块
	getLastBlock(){
		return this.chain[ this.chain.length - 1 ];
	}

	// 将新的区块添加到区块链上
	addBlock(newBlock){
		newBlock.previousHash = this.getLastBlock().hash;
		newBlock.mineBlock(this.diffcult);
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
			var currentBlock = this.chain[i];
			var previousBlock = this.chain[i-1];

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

	// 命名为helloCoin
	var helloCoin = new BlockChain();
	console.log('block 1');
	helloCoin.addBlock(new Block(1,"04/06/2018",{ name : "wangx" }));
	console.log('block 2');
	helloCoin.addBlock(new Block(2,"05/06/2018",{ name : "chenh" }));
	console.log('block 3');
	helloCoin.addBlock(new Block(2,"05/06/2018",{ name : "roe" }));
	console.log('block 4');
	helloCoin.addBlock(new Block(2,"05/06/2018",{ name : "xyz" }));

	// 查看区块链
	console.log(helloCoin);
	// 检验区块链
	console.log(helloCoin.isChainValid());
