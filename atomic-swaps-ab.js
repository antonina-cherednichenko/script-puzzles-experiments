var bitcoin = require('bitcoinjs-lib');

var testnet = bitcoin.networks.testnet;

// derive masterkey
var masterKey = bitcoin.HDNode.fromSeedBuffer(Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'), testnet);
//console.log("masterKey = ", masterKey);

//get addresses for alice and bob
var privKey1 = masterKey.derive(0).keyPair;
var privKey2 = masterKey.derive(1).keyPair;

// setup alice & bob
var alicePrivKey = privKey1;
var bobPrivKey = privKey2;
var aliceAddress = alicePrivKey.getAddress();
var bobAddress = bobPrivKey.getAddress();

var redeemScript = bitcoin.script.compile([
    3,
    bitcoin.opcodes.OP_ADD,
    5,
    bitcoin.opcodes.OP_EQUAL
]);
var scriptPubKey = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(redeemScript))
var address = bitcoin.address.fromOutputScript(scriptPubKey, testnet);

console.error("address = ", address);

var txid = '7f7b9c003078556b9b9a058fceefdbede413b91cc6aa963bab2692b3c73b89bb';
var return_address = 'myUMzCSWHivWdv4MFNygdqeTh17N3G74k3'
var tx = new bitcoin.TransactionBuilder(testnet)
     tx.addInput(txid, 1)
     tx.addOutput(return_address, 500)

var txRaw = tx.buildIncomplete()

var redeemScriptSig = bitcoin.script.scriptHash.input.encode([
        2
      ], redeemScript)

txRaw.setInputScript(0, redeemScriptSig)

console.error(txRaw.toHex());
