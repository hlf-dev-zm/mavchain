"use strict";

const { FileSystemWallet, Gateway } = require("fabric-network");
const fs = require("fs");
const path = require("path");

// capture network variables from config.json
const configPath = path.join(process.cwd(), "config.json");
const configJSON = fs.readFileSync(configPath, "utf8");
const config = JSON.parse(configJSON);
var connectionProvider1 = config.connectionProvider1;
var userId = config.userName;
var gatewayDiscovery = config.gatewayDiscovery;
var channelName = config.channelName;
var contractName = config.contractName;

var ccpPath = path.join(process.cwd(),connectionProvider1);
var ccpJSON = fs.readFileSync(ccpPath, "utf8");
var ccpProvider1 = JSON.parse(ccpJSON);

exports.generate_hash = async function(req, res, _next) {

  const info1 = req.body.info1;
  const info2 = req.body.info2;
  const info3 = req.body.info3;

  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), "/wallet");
  const wallet = new FileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  try {
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpProvider1, { wallet, identity: userId, discovery: gatewayDiscovery });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    // Get the contract from the network.
    const contract = network.getContract(contractName);

    // Submit the specified transaction.
    console.log("\nSubmit Generate Hash transaction.");
    var hash = await contract.submitTransaction("generateHash", info1, info2, info3);
    hash = JSON.parse(hash.toString())
    // Disconnect from the gateway.
    gateway.disconnect();
    console.log("\nTransaction success")
    res.send(hash);
  } catch (err) {
    //print and return error
    console.log(err);
    var error = {};
    if (err.message) { error.Error = err.message, error.Reason = "Generate Hash Failed"}
    if (err.endorsements) { error.Reason = err.endorsements[0].message }
    res.send(error);
  }
};

exports.update_hash_status = async function(req, res, _next) {

  const hash = req.body.hash;
  const partyId = req.body.party_id;
  const status = req.body.status;

  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), "/wallet");
  const wallet = new FileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  try {
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpProvider1, { wallet, identity: userId, discovery: gatewayDiscovery });
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);
    // Get the contract from the network.
    const contract = network.getContract(contractName);

    console.log("\n Submit update hash status transaction ");
    await contract.submitTransaction("updateHashStatus", hash, partyId, status);

    // Disconnect from the gateway.
    gateway.disconnect();
    console.log("\nTransaction success")
    res.send(true);
  } catch (err) {
    //print and return error
    console.log(err)
    var error = {};
    if (err.message) { error.Error = err.message, error.Reason = "Update Hash Failed"}
    if (err.endorsements) { error.Reason = err.endorsements[0].message }
    res.send(error);
  }
};

exports.get_hash_status = async function(req, res, _next) {

  const hash = req.body.hash;

  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), "/wallet");
  const wallet = new FileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  try {
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpProvider1, { wallet, identity: userId, discovery: gatewayDiscovery });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    // Get the contract from the network.
    const contract = network.getContract(contractName);

    console.log("\nsubmit get hash status transaction");
    var status = await contract.submitTransaction("getHashStatus", hash);
    status = JSON.parse(status.toString())
    // Disconnect from the gateway.
    gateway.disconnect();
    console.log("\nTransaction success")
    res.send({status: status});
  } 
  catch (err) {
    //print and return error
    console.log(err);
    var error = {};
    if (err.message) { error.Error = err.message, error.Reason = "Get Hash Failed"}
    if (err.endorsements) { error.Reason = err.endorsements[0].message }
    res.send(error);
  }
};

exports.verify_hash = async function(req, res, _next) {

  const hash = req.body.hash;

   // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), "/wallet");
  const wallet = new FileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  try {
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpProvider1, { wallet, identity: userId, discovery: gatewayDiscovery });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    // Get the contract from the network.
    const contract = network.getContract(contractName);

    console.log("\nSubmit verify hash transaction");
    var status = await contract.submitTransaction("verifyHash", hash);
    status = status.toString()
    // Disconnect from the gateway.
    gateway.disconnect();
    console.log("\nTransaction success")
    res.send({status: status});
  } catch (err) {
    //print and return error
    console.log(err);
    var error = {};
    if (err.message) { error.Error = err.message, error.Reason = "Verify Hash Failed"}
    if (err.endorsements) { error.Reason = err.endorsements[0].message }
    res.send(error);
  }
};