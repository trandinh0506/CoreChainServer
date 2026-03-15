#!/bin/bash
export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/com/orderers/orderer.com/msp/tlscacerts/tlsca.com-cert.pem
export PEER0_HR_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/hr.com/peers/peer0.hr.com/tls/ca.crt
export PEER0_BOARD_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/board.com/peers/peer0.board.com/tls/ca.crt

export CC_NAME="employeecontract"
export CC_SRC_PATH="/opt/gopath/src/github.com/hyperledger/fabric-samples/chaincode"
export CC_RUNTIME_LANGUAGE="node"
export CC_VERSION="1.0"
export CC_SEQUENCE=1

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

echo "Packaging Chaincode..."
peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CC_NAME}_${CC_VERSION}

echo "Installing Chaincode on HrMSP..."
setGlobalsForHr
peer lifecycle chaincode install ${CC_NAME}.tar.gz
# we need to query installed to get the package ID
peer lifecycle chaincode queryinstalled >&log.txt
CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
echo "PackageID is ${CC_PACKAGE_ID}"

echo "Installing Chaincode on BoardMSP..."
setGlobalsForBoard
peer lifecycle chaincode install ${CC_NAME}.tar.gz

echo "Approving Chaincode for HrMSP..."
setGlobalsForHr
peer lifecycle chaincode approveformyorg -o orderer.com:7050 --ordererTLSHostnameOverride orderer.com --tls --cafile $ORDERER_CA --channelID hrmchannel --name ${CC_NAME} --version ${CC_VERSION} --package-id ${CC_PACKAGE_ID} --sequence ${CC_SEQUENCE}

echo "Approving Chaincode for BoardMSP..."
setGlobalsForBoard
peer lifecycle chaincode approveformyorg -o orderer.com:7050 --ordererTLSHostnameOverride orderer.com --tls --cafile $ORDERER_CA --channelID hrmchannel --name ${CC_NAME} --version ${CC_VERSION} --package-id ${CC_PACKAGE_ID} --sequence ${CC_SEQUENCE}

echo "Checking commit readiness..."
peer lifecycle chaincode checkcommitreadiness --channelID hrmchannel --name ${CC_NAME} --version ${CC_VERSION} --sequence ${CC_SEQUENCE} --tls --cafile $ORDERER_CA --output json

echo "Committing Chaincode to channel..."
peer lifecycle chaincode commit -o orderer.com:7050 --ordererTLSHostnameOverride orderer.com --tls --cafile $ORDERER_CA --channelID hrmchannel --name ${CC_NAME} --peerAddresses peer0.hr.com:7051 --tlsRootCertFiles $PEER0_HR_CA --peerAddresses peer0.board.com:9051 --tlsRootCertFiles $PEER0_BOARD_CA --version ${CC_VERSION} --sequence ${CC_SEQUENCE}

echo "Initializing Chaincode..."
setGlobalsForHr
peer chaincode invoke -o orderer.com:7050 --ordererTLSHostnameOverride orderer.com --tls --cafile $ORDERER_CA -C hrmchannel -n ${CC_NAME} --peerAddresses peer0.hr.com:7051 --tlsRootCertFiles $PEER0_HR_CA --peerAddresses peer0.board.com:9051 --tlsRootCertFiles $PEER0_BOARD_CA -c '{"function":"initLedger","Args":[]}'

echo "Chaincode deployment complete."
