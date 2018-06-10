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
	constructor(timestamp,transactions,previousHash = '') {
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nouce = 0;
	}

	/*
	 description: 计算当前区块hash值
	 */
	calculateHash() {
		// 使用类库crypto-js中的sha256加密算法
		return CryptoJS.SHA256(this.previousHash + this.timestamp
			+ JSON.stringify(this.transactions) + this.nouce).toString();
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

		// 区块间存储交易的地方
		this.pendingTransactions = [];

		// 挖矿的回报
		this.miningReward = 100;
	}

	// 创造一个创始区块
	createGenesisBlock(){
		return new Block("04/06/2018","first block","0");
	}

	// 取到上一个区块
	getLastBlock(){
		return this.chain[ this.chain.length - 1 ];
	}

	// 创建一笔交易
	createTransaction(transaction){
		// 校验

		this.pendingTransactions.push(transaction);
	}

	minePendingTransactions(miningRewardAddress){
		let block = new Block(Date.now(),this.pendingTransactions);
		// 挖矿
		block.mineBlock(this.diffcult);

		this.chain.push(block);

		this.pendingTransactions = [
			new Transaction(null,miningRewardAddress,this.miningReward)
		]
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

	// 获取地址余额
	getBalanceOfAddress(address){
  let balance = 0; // you start at zero!

  // 遍历每个区块以及每个区块内的交易
  for(const block of this.chain){
    for(const trans of block.transactions){

      // 如果地址是发起方 -> 减少余额
      if(trans.fromAddress === address){
        balance -= trans.amount;
      }

      // 如果地址是接收方 -> 增加余额
      if(trans.toAddress === address){
        balance += trans.amount;
      }
    }
  }
  return balance;
	}
}


 /*
  * description: 交易类 用来存储多笔交易
	* params: fromAddress 卖家地址
	*	params: toAddress 买家地址
	*	params: amount	交易金额
	*/
class Transaction {
	constructor(fromAddress,toAddress,amount){
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}

 //在下面 可以进行测试
