// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Example {

    // Define a struct (message)
    struct Bid {
        uint256 amount;
        address bidder;
    }

    // Define the types
    string private constant EIP712_DOMAIN = "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)";
    string private constant BID_TYPE = "Bid(uint256 amount,address bidder)";

    // Take hash of defined types
    bytes32 constant private EIP712_DOMAIN_TYPEHASH = keccak256(abi.encodePacked(EIP712_DOMAIN));
    bytes32 constant private BID_TYPEHASH = keccak256(abi.encodePacked(BID_TYPE));

    // Define domain separator - to prevents replay attacks
    bytes32 private DOMAIN_SEPARATOR = keccak256(abi.encode(
        EIP712_DOMAIN_TYPEHASH,
        keccak256("example"),
        keccak256("1.0"),
        31337, // replace this with other chain-id if using any other network. This is hardhat chain-id
        address(this)
    ));

    /**
     * Now take hash of message that you will be passing in verify function as tupple, 
     * and use ecrecover to recover the signer
    */
    function hashBid(Bid memory bid) private view returns (bytes32) {
        return keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(
                BID_TYPEHASH,
                bid.amount,
                bid.bidder
            ))
          // In your case you will be hashing each of your type inside the keccak256 of return statement separately,
        ));
    }

    function verify(address signer, Bid memory bid, bytes32 sigR, bytes32 sigS, uint8 sigV) external view returns (bool) {
        return signer == ecrecover(hashBid(bid), sigV, sigR, sigS);
    }

}