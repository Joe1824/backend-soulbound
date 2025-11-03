// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulboundNFT is ERC721URIStorage, Ownable {
    event SoulboundMinted(address indexed to, uint256 indexed tokenId);

    uint256 public nextTokenId;

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
        Ownable(msg.sender)
    {}

    function mintSoulbound(address to, string memory tokenURI) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit SoulboundMinted(to, tokenId);
        return tokenId;
    }

    // prevent transfers (soulbound)
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: transfer disabled");
        }
        return super._update(to, tokenId, auth);
    }
}
