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

docker-compose -f docker-compose.yml down

docker-compose -f docker-compose.yml up -d ca.mavchain.com orderer.mavchain.com peer0.provider1.mavchain.com peer0.hp1.mavchain.com peer0.hp2.mavchain.com peer0.hp3.mavchain.com couchdb.peer0 couchdb.hp1 couchdb.hp2 couchdb.hp3
docker ps -a

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel
docker exec -e "CORE_PEER_LOCALMSPID=Provider1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@provider1.mavchain.com/msp" peer0.provider1.mavchain.com peer channel create -o orderer.mavchain.com:7050 -c mavchain-channel -f /etc/hyperledger/configtx/channel.tx
# Join peer0.provider1.mavchain.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Provider1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@provider1.mavchain.com/msp" peer0.provider1.mavchain.com peer channel join -b mavchain-channel.block

# fetch the channel block
docker exec -e "CORE_PEER_LOCALMSPID=Provider1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@provider1.mavchain.com/msp" peer0.hp1.mavchain.com peer channel fetch 0 mavchain-channel.block -o orderer.mavchain.com:7050 -c mavchain-channel
# Join peer0.hp1.mavchain.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Provider1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@provider1.mavchain.com/msp" peer0.hp1.mavchain.com peer channel join -b mavchain-channel.block

# fetch the channel block
docker exec -e "CORE_PEER_LOCALMSPID=Provider1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@provider1.mavchain.com/msp" peer0.hp2.mavchain.com peer channel fetch 0 mavchain-channel.block -o orderer.mavchain.com:7050 -c mavchain-channel
# Join peer0.hp2.mavchain.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Provider1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@provider1.mavchain.com/msp" peer0.hp2.mavchain.com peer channel join -b mavchain-channel.block

# fetch the channel block
docker exec -e "CORE_PEER_LOCALMSPID=Provider1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@provider1.mavchain.com/msp" peer0.hp3.mavchain.com peer channel fetch 0 mavchain-channel.block -o orderer.mavchain.com:7050 -c mavchain-channel
# Join peer0.hp3.mavchain.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Provider1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@provider1.mavchain.com/msp" peer0.hp3.mavchain.com peer channel join -b mavchain-channel.block


# # Update anchor peer
docker exec -e "CORE_PEER_LOCALMSPID=Provider1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@provider1.mavchain.com/msp" peer0.provider1.mavchain.com peer channel update -c mavchain-channel -f /etc/hyperledger/configtx/Provider1MSPanchors.tx -o orderer.mavchain.com:7050 