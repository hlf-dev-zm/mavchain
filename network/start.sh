#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
export CHANNEL_NAME=mavchain-channel

docker-compose -f docker-compose.yml down

docker-compose -f docker-compose.yml up -d
docker ps -a

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel
docker exec -e "CORE_PEER_LOCALMSPID=Provider1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@provider1.mavchain.com/msp" peer0.provider1.mavchain.com peer channel create -o orderer.mavchain.com:7050 -c ${CHANNEL_NAME} -f /etc/hyperledger/configtx/channel.tx
# Join peer0.provider1.mavchain.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Provider1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@provider1.mavchain.com/msp" peer0.provider1.mavchain.com peer channel join -b ${CHANNEL_NAME}.block

# fetch the channel block
docker exec -e "CORE_PEER_LOCALMSPID=HP1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@hp1.mavchain.com/msp" peer0.hp1.mavchain.com peer channel fetch 0 ${CHANNEL_NAME}.block -o orderer.mavchain.com:7050 -c ${CHANNEL_NAME}
# Join peer0.hp1.mavchain.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=HP1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@hp1.mavchain.com/msp" peer0.hp1.mavchain.com peer channel join -b ${CHANNEL_NAME}.block

# fetch the channel block
docker exec -e "CORE_PEER_LOCALMSPID=HP2MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@hp2.mavchain.com/msp" peer0.hp2.mavchain.com peer channel fetch 0 ${CHANNEL_NAME}.block -o orderer.mavchain.com:7050 -c ${CHANNEL_NAME}
# Join peer0.hp2.mavchain.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=HP2MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@hp2.mavchain.com/msp" peer0.hp2.mavchain.com peer channel join -b ${CHANNEL_NAME}.block

# fetch the channel block
docker exec -e "CORE_PEER_LOCALMSPID=HP3MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@hp3.mavchain.com/msp" peer0.hp3.mavchain.com peer channel fetch 0 ${CHANNEL_NAME}.block -o orderer.mavchain.com:7050 -c ${CHANNEL_NAME}
# Join peer0.hp3.mavchain.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=HP3MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@hp3.mavchain.com/msp" peer0.hp3.mavchain.com peer channel join -b ${CHANNEL_NAME}.block


# # Update anchor peer
docker exec -e "CORE_PEER_LOCALMSPID=Provider1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@provider1.mavchain.com/msp" peer0.provider1.mavchain.com peer channel update -c ${CHANNEL_NAME} -f /etc/hyperledger/configtx/Provider1MSPanchors.tx -o orderer.mavchain.com:7050

docker exec -e "CORE_PEER_LOCALMSPID=HP1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@hp1.mavchain.com/msp" peer0.hp1.mavchain.com peer channel update -c ${CHANNEL_NAME} -f /etc/hyperledger/configtx/HP1MSPanchors.tx -o orderer.mavchain.com:7050

docker exec -e "CORE_PEER_LOCALMSPID=HP2MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@hp2.mavchain.com/msp" peer0.hp2.mavchain.com peer channel update -c ${CHANNEL_NAME} -f /etc/hyperledger/configtx/HP2MSPanchors.tx -o orderer.mavchain.com:7050

docker exec -e "CORE_PEER_LOCALMSPID=HP3MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@hp3.mavchain.com/msp" peer0.hp3.mavchain.com peer channel update -c ${CHANNEL_NAME} -f /etc/hyperledger/configtx/HP3MSPanchors.tx -o orderer.mavchain.com:7050