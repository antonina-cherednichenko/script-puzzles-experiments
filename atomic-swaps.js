var bitcoin = require('bitcoinjs-lib');

var NETWORK = bitcoin.networks.testnet;

// derive masterkey
var masterKey = bitcoin.HDNode.fromSeedBuffer(Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'), NETWORK);
//console.log("masterKey = ", masterKey);

//get addresses for alice and bob
var privKey1 = masterKey.derive(0).keyPair;
var privKey2 = masterKey.derive(1).keyPair;

// setup alice & bob
var alicePrivKey = privKey1;
var bobPrivKey = privKey2;
var aliceAddress = alicePrivKey.getAddress();
var bobAddress = bobPrivKey.getAddress();

var aliceSecret = 'alicesecret';
var aliceSecretHash = bitcoin.crypto.hash160(aliceSecret);

var aliceToBobRedeemScript = bitcoin.script.compile([
    bitcoin.opcodes.OP_HASH160,
    aliceSecretHash,
    bitcoin.opcodes.OP_EQUALVERIFY
]);

var aliceToBobScriptPubKey = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(aliceToBobRedeemScript))
var aliceToBobP2SHAddress = bitcoin.address.fromOutputScript(aliceToBobScriptPubKey, NETWORK)

var bobToAliceRedeemScript = bitcoin.script.compile([
    bitcoin.opcodes.OP_HASH160,
    aliceSecretHash,
    bitcoin.opcodes.OP_EQUALVERIFY
]);



var bobToAliceScriptPubKey = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(bobToAliceRedeemScript));
var bobToAliceP2SHAddress = bitcoin.address.fromOutputScript(bobToAliceScriptPubKey, NETWORK);

console.log('aliceToBobP2SHAddress; ', aliceToBobP2SHAddress);
console.log('bobToAliceP2SHAddress; ', bobToAliceP2SHAddress);



//try to send money from script to my address
var txid = 'c46adcee8b2e8d15047d722a0fb01d0885d387cc023289ccb28a96e8a7541131'
var addressToSentromScript = 'myUMzCSWHivWdv4MFNygdqeTh17N3G74k3'
var hashType = bitcoin.Transaction.SIGHASH_ALL
var redeemScript = aliceToBobRedeemScript

var txb = new bitcoin.TransactionBuilder(NETWORK)
txb.addInput(txid, 0)
txb.addOutput(addressToSentromScript, 500)
// txb.sign(0, alicePrivKey)

var txRaw = txb.buildIncomplete()
// var signatureHash = txRaw.hashForSignature(0, redeemScript, hashType)
var redeemScriptSig = bitcoin.script.scriptHash.input.encode([aliceSecret], redeemScript) //, [
  // aliceSecret
   //bitcoin.opcodes.OP_TRUE
//],redeemScript)
txRaw.setInputScript(0, redeemScriptSig)


console.log("raw transaction hex = " + txRaw.toHex());

//bitcoin.transactions.propagate(txRaw.toHex(), done)

//txb.sign(0, aliceSecret, bobToAliceScriptPubKey);

// // broadcast our transaction
// var tx = txb.build()
// var txId = tx.getId()
