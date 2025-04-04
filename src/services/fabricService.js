const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

const ccpPath = process.env.CONNECTION_PROFILE_PATH;
const walletPath = process.env.WALLET_PATH;

async function getContract() {
  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: process.env.USER_ID,
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork(process.env.CHANNEL_NAME);
  return network.getContract(process.env.CHAINCODE_NAME);
}

exports.registerCustomer = async (name) => {
  const contract = await getContract();
  return await contract.submitTransaction("RegisterCustomer", name);
};

exports.getCustomerProfile = async (customerId) => {
  const contract = await getContract();
  const result = await contract.evaluateTransaction(
    "GetCustomerProfile",
    customerId
  );
  return JSON.parse(result.toString());
};
