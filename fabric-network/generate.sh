#!/bin/bash
# Generate crypto material and channel artifacts

export PATH=${PWD}/bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}

echo "Cleaning up old artifacts..."
rm -rf organizations/peerOrganizations organizations/ordererOrganizations channel-artifacts/*

# Ensure channel-artifacts directory exists
mkdir -p channel-artifacts

echo "Generating crypto material..."
cryptogen generate --config=./crypto-config.yaml --output="organizations"

if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi

echo "Generating Orderer Genesis block..."
configtxgen -profile TwoOrgsApplicationGenesis -channelID system-channel -outputBlock ./channel-artifacts/genesis.block

if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi

echo "Generating channel configuration transaction 'hrmchannel.tx'..."
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/hrmchannel.tx -channelID hrmchannel

if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi

echo "Generating anchor peer update for HrMSP..."
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/HrMSPanchors.tx -channelID hrmchannel -asOrg HrMSP

echo "Generating anchor peer update for BoardMSP..."
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/BoardMSPanchors.tx -channelID hrmchannel -asOrg BoardMSP

echo "Artifacts generated successfully."
