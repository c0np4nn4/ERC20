// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KingRefund {
    address public king; // 현재의 king 주소
    uint256 public prize; // 현재까지 king이 되기 위해 지불해야 할 금액

    mapping(address => uint256) public refunds; // 각 주소별 환불 금액을 저장하는 매핑

    event FundsToBeWithdrawn(address indexed previousKing, uint256 amount); // 환불해야 할 금액에 대한 정보를 로그로 기록하는 이벤트

    constructor() {
        king = msg.sender; // 컨트랙트를 배포한 사람을 초기 king으로 설정
        prize = 1 ether; // 초기 king이 되기 위한 금액을 1 이더로 설정
    }

    // function becomeKing() external payable {
    receive() external payable {
        require(msg.value > prize, "Need to pay more to become the king"); // 보내는 금액이 현재 prize보다 커야 합니다.

        if (king != address(0)) {
            // 만약 현재 king이 설정되어 있다면
            uint256 refundAmount = prize; // 환불해야 할 금액을 현재 prize로 설정
            refunds[king] += refundAmount; // 환불해야 할 금액을 해당 king의 환불금액에 추가
            emit FundsToBeWithdrawn(king, refundAmount); // 환불 금액에 대한 이벤트를 발생시킵니다.
        }

        king = msg.sender; // 메시지를 보낸 사람을 새로운 king으로 설정
        prize = msg.value; // king이 되기 위한 새로운 금액을 설정
    }

    function withdraw() external {
        uint256 amount = refunds[msg.sender]; // 호출한 주소의 환불 금액을 가져옵니다.
        require(amount > 0, "No funds to withdraw"); // 환불할 금액이 있어야 합니다.

        refunds[msg.sender] = 0; // 환불 금액을 0으로 설정하여 중복 환불을 방지합니다.
        payable(msg.sender).transfer(amount); // 환불 금액을 호출한 주소에 반환합니다.
    }
}
