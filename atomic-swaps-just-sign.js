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


//OP_DUP OP_HASH160 [BOB PUBKEYHASH] OP_EQUALVERIFY OP_CHECKSIG OP_HASH160 [HASH SECRET] OP_EQUAL
var aliceToBobRedeemScript = bitcoin.script.compile([
    bQ.getPublicKeyBuffer(),
    bitcoin.opcodes.OP_CHECKSIG,
]);

let addressToSentromScript = 'mffVPNekSwA8JPxWUcweG1Vv96irkwgVPV'



function createP2SH() {

  //console.log('SCRIPT = ', bitcoin.script.toASM(aliceToBobRedeemScript));

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
      bQ.sign(signatureHash).toScriptSignature(hashType)

  ], redeemScript);

  txRaw.setInputScript(0, redeemScriptSig)

  //console.log('SCRIPT = ', bitcoin.script.toASM(redeemScriptSig));


  console.log("raw transaction hex = " + txRaw.toHex());
}

createP2SH();
redeemBTCFromScript('63bf4502965fb0e2cc28f34d2ba2a9ad7f77323e776d318cde561a9e82b9a77f', 1)




//try to send money from script to my address
// var txid = '19177214c94bfadd1a62977d95894387dc2b5640fbb5203015f8a0ba0d3a6b41'
// var addressToSentromScript = 'mffVPNekSwA8JPxWUcweG1Vv96irkwgVPV'



//bitcoin.transactions.propagate(txRaw.toHex(), done)

//txb.sign(0, aliceSecret, bobToAliceScriptPubKey);

// // broadcast our transaction
// var tx = txb.build()
// var txId = tx.getId()
