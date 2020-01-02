CC_RUNTIME_LANGUAGE=golang
CC_SRC_PATH=github.com/mavchain-cc
CHANNEL=mavchain-channel
CHAINCODE=mavchain-cc
CONFIG_ROOT=/opt/gopath/src/github.com/hyperledger/fabric/peer
ORG1_MSPCONFIGPATH=${CONFIG_ROOT}/crypto/peerOrganizations/provider1.mavchain.com/users/Admin@provider1.mavchain.com/msp
ORG2_MSPCONFIGPATH=${CONFIG_ROOT}/crypto/peerOrganizations/hp1.mavchain.com/users/Admin@hp1.mavchain.com/msp
ORG3_MSPCONFIGPATH=${CONFIG_ROOT}/crypto/peerOrganizations/hp2.mavchain.com/users/Admin@hp2.mavchain.com/msp
ORG4_MSPCONFIGPATH=${CONFIG_ROOT}/crypto/peerOrganizations/hp3.mavchain.com/users/Admin@hp3.mavchain.com/msp

set -x

echo "Installing smart contract on peer0.provider1.mavchain.com"
docker exec \
  -e CORE_PEER_LOCALMSPID=Provider1MSP \
  -e CORE_PEER_ADDRESS=peer0.provider1.mavchain.com:7051 \
  -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
  cli \
  peer chaincode install \
    -n $CHAINCODE \
    -v 1.0 \
    -p "$CC_SRC_PATH" \
    -l "$CC_RUNTIME_LANGUAGE"

echo "Installing smart contract on peer0.hp1.mavchain.com"
docker exec \
  -e CORE_PEER_LOCALMSPID=HP1MSP \
  -e CORE_PEER_ADDRESS=peer0.hp1.mavchain.com:8051 \
  -e CORE_PEER_MSPCONFIGPATH=${ORG2_MSPCONFIGPATH} \
  cli \
  peer chaincode install \
    -n $CHAINCODE \
    -v 1.0 \
    -p "$CC_SRC_PATH" \
    -l "$CC_RUNTIME_LANGUAGE"

echo "Installing smart contract on peer0.hp2.mavchain.com"
docker exec \
  -e CORE_PEER_LOCALMSPID=HP2MSP \
  -e CORE_PEER_ADDRESS=peer0.hp2.mavchain.com:9051 \
  -e CORE_PEER_MSPCONFIGPATH=${ORG3_MSPCONFIGPATH} \
  cli \
  peer chaincode install \
    -n $CHAINCODE \
    -v 1.0 \
    -p "$CC_SRC_PATH" \
    -l "$CC_RUNTIME_LANGUAGE"

echo "Installing smart contract on peer0.hp3.mavchain.com"
docker exec \
  -e CORE_PEER_LOCALMSPID=HP3MSP \
  -e CORE_PEER_ADDRESS=peer0.hp3.mavchain.com:10051 \
  -e CORE_PEER_MSPCONFIGPATH=${ORG4_MSPCONFIGPATH} \
  cli \
  peer chaincode install \
    -n $CHAINCODE \
    -v 1.0 \
    -p "$CC_SRC_PATH" \
    -l "$CC_RUNTIME_LANGUAGE"

echo "Instantiating smart contract on mavchain-channel"
docker exec \
  -e CORE_PEER_LOCALMSPID=Provider1MSP \
  -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
  cli \
  peer chaincode instantiate \
    -o orderer.mavchain.com:7050 \
    -C $CHANNEL \
    -n $CHAINCODE \
    -l "$CC_RUNTIME_LANGUAGE" \
    -v 1.0 \
    -c '{"Args":[]}' \
    -P "AND('Provider1MSP.member','HP1MSP.member','HP2MSP.member','HP3MSP.member')"

#echo "Waiting for instantiation request to be committed ..."
# sleep 10

# echo "Submitting initLedger transaction to smart contract on ${CHANNEL}"
# echo "The transaction is sent to the peer with the chaincode installed (peer0.provider1.mavchain.com) so that chaincode is built before receiving the following requests"
# docker exec \
#   -e CORE_PEER_LOCALMSPID=Provider1MSP \
#   -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
#   cli \
#   peer chaincode invoke \
#     -o orderer.mavchain.com:7050 \
#     -C $CHANNEL \
#     -n $CHAINCODE \
#     -c '{"function":"initLedger","Args":[]}' \
#     --waitForEvent \
#     --peerAddresses peer0.provider1.mavchain.com:7051 \
#     --peerAddresses peer0.hp1.example.com:8051
#     --peerAddresses peer0.hp2.example.com:9051
#     --peerAddresses peer0.hp3.example.com:10051
set +x
