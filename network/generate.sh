#!/bin/sh
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
CHANNEL_NAME=mavchain-channel
SYS_CHANNEL=mavchain-sys-channel

# remove previous crypto material and config transactions
rm -fr config/*
rm -fr crypto-config/*

# generate crypto material
cryptogen generate --config=./crypto-config.yaml
if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi

# generate genesis block for orderer
configtxgen -profile FourOrgOrdererGenesis -outputBlock ./config/genesis.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi

# generate channel configuration transaction
configtxgen -profile FourOrgChannel -outputCreateChannelTx ./config/channel.tx -channelID $CHANNEL_NAME
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi

# generate anchor peer transaction
configtxgen -profile FourOrgChannel -outputAnchorPeersUpdate ./config/Provider1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Provider1MSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Provider1MSP..."
  exit 1
fi

configtxgen -profile FourOrgChannel -outputAnchorPeersUpdate ./config/HP1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg HP1MSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Provider1MSP..."
  exit 1
fi

configtxgen -profile FourOrgChannel -outputAnchorPeersUpdate ./config/HP2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg HP2MSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Provider1MSP..."
  exit 1
fi

configtxgen -profile FourOrgChannel -outputAnchorPeersUpdate ./config/HP3MSPanchors.tx -channelID $CHANNEL_NAME -asOrg HP3MSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Provider1MSP..."
  exit 1
fi