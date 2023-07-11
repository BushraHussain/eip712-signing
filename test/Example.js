const { expect } = require("chai");
const  { ethers } = require("hardhat");

// types 
const domain = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" }
];
const bid = [
    { name: "amount", type: "uint256" },
    { name: "bidder", type: "address" },
];

// Message
var message = {
    amount: 100,
    bidder: "0xF6f8196eEE9B04a3cF5711C32A21A8fd625E5dAA"
};

// Domain Data
var domainData = {  
    name: "example",
    version: "1.0",
    chainId: 31337, // Hardhat chain ID
    verifyingContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
}

// Make data object to sign
const data = JSON.stringify({
    types: {
        EIP712Domain: domain,
        Bid: bid,
    },
    domain: domainData,
    primaryType: "Bid",
    message: message
});

async function getSign (signer) {
    let sign;
    try {
        sign = await signer.provider.send("eth_signTypedData_v4", [signer.address, data]);    
    } catch (error) {
        console.log(error);     
    }
    return sign;
}

describe("Example contract ", function () {
    let example ;
    let owner;
    
    before(async function () {
        [owner, spender] = await ethers.getSigners();

        // Deploy contract
        example = await ethers.deployContract("Example");         
    })

    it("Should verify signature on-chain ", async function () {

        // Get off-chain signature    
        let sign = await getSign(owner);

        //split signature 
        let r,s,v;
        const signature = sign.substring(2);
        r = "0x" + signature.substring(0, 64);
        s = "0x" + signature.substring(64, 128);
        v = parseInt(signature.substring(128, 130), 16);

        // call the contract function 
        const res = await example.verify(owner.address, message, r, s, v);
        console.log("RESULT :", res); // should be true
       
    })

})