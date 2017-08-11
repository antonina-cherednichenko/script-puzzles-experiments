var bitcoin = require('bitcoinjs-lib');

//https://live.blockcypher.com/btc-testnet/address/2N6funkq162Brfo8QrBJPn9pUZN69eh4ycr/
//https://live.blockcypher.com/btc-testnet/tx/954f42ef7046afefae02cc0410524c2b45faf71c5d2c077c170a79aac9c5a757/

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


console.log("3 encoded = ", bitcoin.script.number.encode(3));
console.log("5 encoded = ", bitcoin.script.number.encode(5));
var redeemScript = bitcoin.script.compile([
    bitcoin.script.number.encode(3),
    bitcoin.opcodes.OP_ADD,
    bitcoin.script.number.encode(5),
    bitcoin.opcodes.OP_EQUAL
]);
var scriptPubKey = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(redeemScript))
var address = bitcoin.address.fromOutputScript(scriptPubKey, testnet);

console.error("address = ", address);

var txid = '4a9c85372f46a07b24f389d434abcbff8c1ff2edecd5a2284c54c856f852fda1';
var return_address = 'mffVPNekSwA8JPxWUcweG1Vv96irkwgVPV'
var tx = new bitcoin.TransactionBuilder(testnet)
     tx.addInput(txid, 1)
     tx.addOutput(return_address, 500)

//tx.sign(0, alicePrivKey);

var txRaw = tx.buildIncomplete()

var redeemScriptSig = bitcoin.script.scriptHash.input.encode([
        bitcoin.script.number.encode(2)
      ], redeemScript)

console.log("redeem script sig = ", redeemScriptSig);

txRaw.setInputScript(0, redeemScriptSig)

console.error(txRaw.toHex());
