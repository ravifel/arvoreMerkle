const crypto = require("crypto"),
  SHA256 = (message) =>
    crypto.createHash("sha256").update(message).digest("hex");

const MerkelTree = require("./MerkelTree");
const TransactionList = require("./TransactionList");
const Transaction = require("./Transaction");

let transactionList = new TransactionList();

class Block {
  constructor(index, timestamp = "", transacao, prevHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.transacao = transacao;
    this.hash = this.getHash();
    this.prevHash = prevHash;
    this.nonce = 0;
  }

  //Metodo de mineração (Prova de Trabalho)
  mineration(difficulty) {
    //vamos aumentar o valor do "nonce" até conseguir o HASH que precisamos
    while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
      //vai criar uma matriz vazia com o tamanho da dificuldade "+1"
      //quando juntar isso vai obter uma string consistente em zeros com o tamanho da dificuldade

      this.nonce++; //se não corresponder, continuaremos aumentando o valor do nonce
      this.hash = this.getHash(); //valor do HASH vai ser TUALIZADO

      console.log("Hash do bloco minerado: " + this.hash);
    }
  }

  //função para gerar o HASH
  getHash() {
    return SHA256(
      this.index +
        this.prevHash +
        this.timestamp +
        JSON.stringify(this.transacao) +
        this.nonce
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [new Block(Date.now().toString())];
    this.difficulty = 3; //adereço de dificuldade
  }

  //Metodo para pegar o último bloco da cadeia
  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  //Metodo para adicionar um bloco
  addBlock(block) {
    block.prevHash = this.getLastBlock().hash; //hash do último bloco
    block.hash = block.getHash(); //recalcular o hash, para o proximo bloco

    block.mineration(this.difficulty); //chamando a mineração, chamando a dificuldade como parametro

    this.chain.push(block); //empurrando o bloco para a cadeia
  }

  //Metodo para saber se o bloco é valido ou não
  isValid(blockchain = this) {
    for (let i = 1; i < blockchain.chain.length; i++) {
      const currentBlock = blockchain.chain[i]; //bloco atual
      const prevBlock = blockchain.chain[i - 1]; //bloco anterior

      //uma blockchain é válida quando o HASH está inalterado
      //e também a prevHash deve ser igual a HAS do bloco anterior
      if (
        currentBlock.hash !== currentBlock.getHash() ||
        currentBlock.prevHash !== prevBlock.hash
      ) {
        var mensagem = "O bloco é v";
        return false; //Não validado
      }

      return true; //Validado
    }
  }
}

function transacao() {
  transactionList.list = [];
  for (let index = 0; index < 8; index++) {
    transactionList.add(
      new Transaction(Math.random(), Math.random(), Math.random())
    );
  }
  const tree = new MerkelTree();
  tree.createTree(transactionList.list);
  return tree;
}

//---> criando uma nova cadeia para teste
const RaviRayaneChain = new Blockchain();
RaviRayaneChain.addBlock(new Block(1, Date.now().toString(), transacao()));
RaviRayaneChain.addBlock(new Block(Date.now().toString(), transacao()));
RaviRayaneChain.addBlock(new Block(Date.now().toString(), transacao()));
RaviRayaneChain.addBlock(new Block(Date.now().toString(), transacao()));
RaviRayaneChain.addBlock(new Block(Date.now().toString(), transacao()));
RaviRayaneChain.addBlock(new Block(Date.now().toString(), transacao()));
RaviRayaneChain.addBlock(new Block(Date.now().toString(), transacao()));
RaviRayaneChain.addBlock(new Block(Date.now().toString(), transacao()));
RaviRayaneChain.addBlock(new Block(Date.now().toString(), transacao()));
RaviRayaneChain.addBlock(new Block(Date.now().toString(), transacao()));
//console.log(RaviRayaneChain.chain);
//console.log("Mostrando a cadeia de blocos");

//---> verificando se a função é valida/
//---> se for valida vai retornar "true"
console.log(
  RaviRayaneChain.isValid() ? "A cadeia é válida" : "A cadeia não é válida"
);

//---> aqui iremos mudar algum dado do bloco e solicitar a validação (irá dar falso)
RaviRayaneChain.chain[3].transacao = 3;
RaviRayaneChain.chain[3].hash = RaviRayaneChain.chain[3];
console.log(RaviRayaneChain.chain);
console.log(
  RaviRayaneChain.isValid() ? "A cadeia é válida" : "A cadeia não é válida"
);

//---> testando com a mineração
// const RaviRayaneChain2 = new Blockchain();
// RaviRayaneChain2.addBlock(new Block(Date.now().toString(), ["100,00 BTC"]));
// RaviRayaneChain2.addBlock(new Block(Date.now().toString(), ["200,00 BTC"]));
// RaviRayaneChain2.addBlock(new Block(Date.now().toString(), ["300,00 BTC"]));
// RaviRayaneChain2.addBlock(new Block(Date.now().toString(), ["39,00 BTC"]));
// RaviRayaneChain2.addBlock(new Block(Date.now().toString(), ["358,07 BTC"]));
// RaviRayaneChain2.addBlock(new Block(Date.now().toString(), ["789,00 BTC"]));
// RaviRayaneChain2.addBlock(new Block(Date.now().toString(), ["88,79 BTC"]));
// RaviRayaneChain2.addBlock(new Block(Date.now().toString(), ["3579,02 BTC"]));
// RaviRayaneChain2.addBlock(new Block(Date.now().toString(), ["4,93 BTC"]));
// RaviRayaneChain2.addBlock(new Block(Date.now().toString(), ["271,88 BTC"]));
// console.log(RaviRayaneChain2.chain);
// console.log("Mostrando a cadeia de blocos no teste com a mineração");

//OBSERVAÇÕES -->
//o blockchain é uma lista com os blocos
//então vamos criar uma propriedade chamada "chain" para armazenar os blocos
//o bloco genesis é o bloco inicial da cadeia de blocos
//o bloco Genesis vai manter a cadeia em funcionamento
//
//quando você muda qualquer detalhe de cada coisa em seu bloco (mesmo que pequeno), o HASH vai sair diferente
//isso garante como podemos notar como o bloco é alterado
//isso irá garantir a imutabilidade da cadeia de blocos
