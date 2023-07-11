# EIP712 - Typed structured data hashing and signing
Signing off-chain typed data & verifying signature on-chain (EIP712)

# Tools & Environment 
Hardhat, Ethers

# Signing Method
eth_signTypedData_v4

`const sign = await signer.provider.send("eth_signTypedData_v4", [signer.address, data]);`







