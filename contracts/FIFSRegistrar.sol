pragma solidity ^0.4.18;

import "./ENS.sol";

/**
 * A registrar that allocates subdomains to the first person to claim them.
 */
contract FIFSRegistrar {
    ENS ens;
    bytes32 rootNode;

    event LogAddr(
        address indexed addr,
        string str
        );

    event LogB32(
        bytes32 indexed b32,
        string str
        );   

    event LogBool(
        bool indexed bl,
        string str
        );            

    modifier only_owner(bytes32 subnode) {
        emit LogAddr(msg.sender, 'str');
        emit LogB32(subnode, 'subnode');
        emit LogB32(rootNode, 'rootNode');
        emit LogB32(keccak256(rootNode, subnode), 'hash');
        emit LogAddr(msg.sender, 'sender');
        emit LogAddr(ens.owner(keccak256(rootNode, subnode)), 'owner');
        emit LogBool(currentOwner == 0, 'co is 0');

        address currentOwner = ens.owner(keccak256(rootNode, subnode));
        require(currentOwner == 0 || currentOwner == msg.sender);
        _;
    }

    /**
     * Constructor.
     * @param ensAddr The address of the ENS registry.
     * @param node The node that this registrar administers.
     */
    function FIFSRegistrar(ENS ensAddr, bytes32 node) public {
        ens = ensAddr;
        rootNode = node;
    }

    /**
     * Register a name, or change the owner of an existing registration.
     * @param subnode The hash of the label to register.
     * @param owner The address of the new owner.
     */
    function register(bytes32 subnode, address owner) public only_owner(subnode) {
        ens.setSubnodeOwner(rootNode, subnode, owner);
    }
}
