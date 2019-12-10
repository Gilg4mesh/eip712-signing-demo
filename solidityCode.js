const solidityCode =
`
pragma experimental ABIEncoderV2;
pragma solidity ^0.5.0;

contract Verifier {
    uint256 constant chainId = <CHAINID>;
    address constant verifyingContract = 0x1C56346CD2A2Bf3202F771f50d3D14a367B48070;
    
    string private constant EIP712_DOMAIN  = "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)";
    string private constant BID_TYPE = "Bid(address delegate,address token,uint256 nonce,address from,address to,uint256 value,uint256 fee)";
    
    bytes32 private constant EIP712_DOMAIN_TYPEHASH = keccak256(abi.encodePacked(EIP712_DOMAIN));
    bytes32 private constant BID_TYPEHASH = keccak256(abi.encodePacked(BID_TYPE));
    bytes32 private constant DOMAIN_SEPARATOR = keccak256(abi.encode(
        EIP712_DOMAIN_TYPEHASH,
        keccak256("DelegateTransferToken"),
        keccak256("1"),
        chainId,
        verifyingContract
    ));
    
    struct Bid {
        address delegate;
        address token;
        uint256 nonce;
        address from;
        address to;
        uint256 value;
        uint256 fee;
    }
    
    function hashBid(Bid memory bid) private pure returns (bytes32){
        return keccak256(abi.encodePacked(
            "\\x19\\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(
                BID_TYPEHASH,
                bid.delegate,
                bid.token,
                bid.nonce,
                bid.from,
                bid.to,
                bid.value,
                bid.fee
            ))
        ));
    }
    
    function verify() public pure returns (bool) {
        Bid memory bid = Bid({
            delegate: 0x3333333333333333333333333333333333333333,
            token: 0x3333333333333333333333333333333333333333,
            nonce: 1,
            from: 0x3333333333333333333333333333333333333333,
            to: 0x3333333333333333333333333333333333333333,
            value: 0,
            fee: 0
        });
            
        bytes32 sigR = <SIGR>;
        bytes32 sigS = <SIGS>;
        uint8 sigV = <SIGV>;
        address signer = <SIGNER>;
    
        return signer == ecrecover(hashBid(bid), sigV, sigR, sigS);
    }
}
`.trim();
