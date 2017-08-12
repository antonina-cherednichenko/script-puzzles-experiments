var bitcoin = require('bitcoinjs-lib');

var testnet = bitcoin.networks.testnet;

// derive masterkey
var masterKey = bitcoin.HDNode.fromSeedBuffer(Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzaggafafasd'), testnet);
//console.log("masterKey = ", masterKey);

//get addresses for alice and bob
// var privKey1 = masterKey.derive(0).keyPair;
// var privKey2 = masterKey.derive(1).keyPair;

// setup alice & bob
// var alicePrivKey = privKey1;
// var bobPrivKey = privKey2;
// var aliceAddress = alicePrivKey.getAddress();
// var bobAddress = bobPrivKey.getAddress();

let aliceSecret = Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzfddffd');
let aliceSecretHash = bitcoin.crypto.hash160(aliceSecret);
console.log('alice secret = ', aliceSecret);

let addressToSentromScript = 'mffVPNekSwA8JPxWUcweG1Vv96irkwgVPV'

var aliceToBobRedeemScript = bitcoin.script.compile([
    bitcoin.opcodes.OP_HASH160,
    //bitcoin.script.number.encode(1221212),
    aliceSecretHash,
    bitcoin.opcodes.OP_EQUAL
]);


function createP2SH() {

  //console.log('SCRIPT = ', bitcoin.script.toASM(aliceToBobRedeemScript));

  var aliceToBobScriptPubKey = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(aliceToBobRedeemScript))
  var aliceToBobP2SHAddress = bitcoin.address.fromOutputScript(aliceToBobScriptPubKey, testnet)

  console.log('aliceToBobP2SHAddress; ', aliceToBobP2SHAddress);
}

function redeemBTCFromScript(txid, inputNum) {
  var redeemScript = aliceToBobRedeemScript

  var txb = new bitcoin.TransactionBuilder(testnet)
  txb.addInput(txid, inputNum)
  txb.addOutput(addressToSentromScript, 10000)

  var txRaw = txb.buildIncomplete()
  // var signatureHash = txRaw.hashForSignature(0, redeemScript, hashType)
  var redeemScriptSig = bitcoin.script.scriptHash.input.encode([
     aliceSecret
  ], redeemScript)
  txRaw.setInputScript(0, redeemScriptSig)

  //console.log('SCRIPT = ', bitcoin.script.toASM(redeemScriptSig));


  console.log("raw transaction hex = " + txRaw.toHex());
}

createP2SH();
redeemBTCFromScript('6be26474b8f151558b6e8aab5da47a9557b2a800682a2738a4e84393646d26e1', 0)




//try to send money from script to my address
// var txid = '19177214c94bfadd1a62977d95894387dc2b5640fbb5203015f8a0ba0d3a6b41'
// var addressToSentromScript = 'mffVPNekSwA8JPxWUcweG1Vv96irkwgVPV'



//bitcoin.transactions.propagate(txRaw.toHex(), done)

//txb.sign(0, aliceSecret, bobToAliceScriptPubKey);

// // broadcast our transaction
// var tx = txb.build()
// var txId = tx.getId()
