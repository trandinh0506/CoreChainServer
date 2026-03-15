#!/bin/bash
export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/com/orderers/orderer.com/msp/tlscacerts/tlsca.com-cert.pem
export PEER0_HR_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/hr.com/peers/peer0.hr.com/tls/ca.crt
export PEER0_BOARD_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/board.com/peers/peer0.board.com/tls/ca.crt

setGlobalsForHr() {
    export CORE_PEER_LOCALMSPID="HrMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_HR_CA
    export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/hr.com/users/Admin@hr.com/msp
    export CORE_PEER_ADDRESS=peer0.hr.com:7051
}

setGlobalsForBoard() {
    export CORE_PEER_LOCALMSPID="BoardMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_BOARD_CA
    export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/board.com/users/Admin@board.com/msp
    export CORE_PEER_ADDRESS=peer0.board.com:9051
}

echo "Creating channel hrmchannel..."
setGlobalsForHr
peer channel create -o orderer.com:7050 -c hrmchannel -f ./channel-artifacts/hrmchannel.tx --outputBlock ./channel-artifacts/hrmchannel.block --tls --cafile $ORDERER_CA

echo "Joining HrMSP peer to the channel..."
setGlobalsForHr
peer channel join -b ./channel-artifacts/hrmchannel.block

echo "Joining BoardMSP peer to the channel..."
setGlobalsForBoard
peer channel join -b ./channel-artifacts/hrmchannel.block

echo "Setting anchor peer for HrMSP..."
setGlobalsForHr
peer channel update -o orderer.com:7050 -c hrmchannel -f ./channel-artifacts/HrMSPanchors.tx --tls --cafile $ORDERER_CA

echo "Setting anchor peer for BoardMSP..."
setGlobalsForBoard
peer channel update -o orderer.com:7050 -c hrmchannel -f ./channel-artifacts/BoardMSPanchors.tx --tls --cafile $ORDERER_CA

echo "Channel created and peers joined."
