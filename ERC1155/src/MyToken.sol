// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// OpenZeppelin 라이브러리 임포트
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract WarlusERC1155NFT is ERC1155, Ownable {
    using Strings for uint256;

    // 토큰 ID와 URI를 매핑
    mapping(uint256 => string) private _tokenURIs;

    // 이벤트: 새로운 URI가 설정될 때 발생
    event URISet(uint256 indexed id, string uri);

    constructor() ERC1155("") {
        // 초기 URI는 비워둡니다. 개별 URI를 설정할 예정입니다.
    }

    /**
     * @dev 토큰의 URI를 반환합니다.
     * @param tokenId 조회할 토큰 ID
     * @return 토큰의 URI
     */
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        require(bytes(_tokenURIs[tokenId]).length > 0, "URI: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    /**
     * @dev 새로운 토큰을 민트하고 URI를 설정합니다.
     * @param account 토큰을 받을 주소
     * @param id 토큰 ID
     * @param amount 토큰 수량
     * @param tokenURI 토큰의 URI (warlus를 통해 호스팅된 URI)
     */
    function mint(address account, uint256 id, uint256 amount, string memory tokenURI) public onlyOwner {
        _mint(account, id, amount, "");
        _setURI(id, tokenURI);
    }

    /**
     * @dev 이미 존재하는 토큰의 URI를 업데이트합니다.
     * @param id 업데이트할 토큰 ID
     * @param newURI 새로운 URI
     */
    function setURI(uint256 id, string memory newURI) public onlyOwner {
        require(bytes(_tokenURIs[id]).length != 0, "URI: URI set of nonexistent token");
        _setURI(id, newURI);
    }

    /**
     * @dev 내부 함수로 URI를 설정하고 이벤트를 발생시킵니다.
     * @param id 토큰 ID
     * @param tokenURI 설정할 URI
     */
    function _setURI(uint256 id, string memory tokenURI) internal {
        _tokenURIs[id] = tokenURI;
        emit URISet(id, tokenURI);
        emit URI(tokenURI, id);
    }

    /**
     * @dev 토큰을 소각하고 URI를 삭제합니다.
     * @param account 소각할 토큰 소유자 주소
     * @param id 소각할 토큰 ID
     * @param amount 소각할 토큰 수량
     */
    function burn(address account, uint256 id, uint256 amount) public onlyOwner {
        _burn(account, id, amount);
        if(balanceOf(account, id) == 0){
            delete _tokenURIs[id];
        }
    }
}

