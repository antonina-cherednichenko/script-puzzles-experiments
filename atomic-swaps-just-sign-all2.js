var bitcoin = require('bitcoinjs-lib');

var testnet = bitcoin.networks.testnet;

// derive masterkey
var masterKey = bitcoin.HDNode.fromSeedBuffer(Buffer.from('zzzzzzzzzzzzzzzzdffsfsdafafzzzzzzzzzzzzzzaggafafasd'), testnet);
//console.log("masterKey = ", masterKey);

// setup alice & bob
var aQ = masterKey.derive(0).keyPair;
var bQ = masterKey.derive(1).keyPair;
var aliceAddress = aQ.getAddress();
var bobAddress = bQ.getAddress();
console.log("alice address = ", aliceAddress);
console.log("bob address = ", bobAddress);



let secret = Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzfddffd');
let secretHash = bitcoin.crypto.hash160(secret);

//53c63e8d014099ce4f4bc6cbc2ef446449a63ee3917c3dc85a33793f4157746a
//OP_DUP OP_HASH160 [BOB PUBKEYHASH] OP_EQUALVERIFY OP_CHECKSIGVERIFY OP_HASH160 [HASH SECRET] OP_EQUAL
var aliceToBobRedeemScript = bitcoin.script.compile([
    bitcoin.opcodes.OP_DUP,
    bitcoin.opcodes.OP_HASH160,
    bitcoin.crypto.hash160(bQ.getPublicKeyBuffer()),
    bitcoin.opcodes.OP_EQUALVERIFY,
    bitcoin.opcodes.OP_CHECKSIGVERIFY,
    bitcoin.opcodes.OP_HASH160,
    secretHash,
    bitcoin.opcodes.OP_EQUAL
]);

let addressToSentromScript = 'mffVPNekSwA8JPxWUcweG1Vv96irkwgVPV'



function createP2SH() {

  //console.log('ALICE SCRIPT = ', bitcoin.script.toASM(aliceToBobRedeemScript));

  var aliceToBobScriptPubKey = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(aliceToBobRedeemScript))
  var aliceToBobP2SHAddress = bitcoin.address.fromOutputScript(aliceToBobScriptPubKey, testnet)

  console.log('aliceToBobP2SHAddress; ', aliceToBobP2SHAddress);
}



function redeemBTCFromScript(txid, inputNum) {
  var redeemScript = aliceToBobRedeemScript

  var hashType = bitcoin.Transaction.SIGHASH_ALL


  var txb = new bitcoin.TransactionBuilder(testnet)
  txb.addInput(txid, inputNum)
  txb.addOutput(addressToSentromScript, 1000)

  var txRaw = txb.buildIncomplete()
  var signatureHash = txRaw.hashForSignature(0, redeemScript, hashType)
  var redeemScriptSig = bitcoin.script.scriptHash.input.encode([
      secret,
      bQ.sign(signatureHash).toScriptSignature(hashType),
      bQ.getPublicKeyBuffer()


  ], redeemScript);

  console.log("signature = ", bQ.sign(signatureHash).toScriptSignature(hashType));

  txRaw.setInputScript(0, redeemScriptSig)

  //console.log('SCRIPT AGAIN = ', bitcoin.script.toASM(redeemScriptSig));


  console.log("raw transaction hex = " + txRaw.toHex());
}
//af01ffbcb0d9a82f0e477fbfbee376bb5b5c51492c0409d4d8835e98205d4649
createP2SH();
redeemBTCFromScript('7811cfa6986db93a566364d7e3c0de30d1df9fd60f26d3a2b5ac345d73440c4c', 0)




//try to send money from script to my address
// var txid = '19177214c94bfadd1a62977d95894387dc2b5640fbb5203015f8a0ba0d3a6b41'
// var addressToSentromScript = 'mffVPNekSwA8JPxWUcweG1Vv96irkwgVPV'



//bitcoin.transactions.propagate(txRaw.toHex(), done)

//txb.sign(0, aliceSecret, bobToAliceScriptPubKey);

// // broadcast our transaction
// var tx = txb.build()
// var txId = tx.getId()
