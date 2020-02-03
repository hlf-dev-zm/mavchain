#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -v

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)

# clean the keystore
rm -rf ./app/wallet/*

# launch network; create channel and join peer to channel
cd network
./teardown.sh
./start.sh
cd ../chaincode
./installInstantiateInvoke.sh

cd ../app
node enrollAdmin.js
node registerEnrollUser.js
node server.js
