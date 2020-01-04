package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// PartyChaincode example simple Chaincode implementation
type PartyChaincode struct {
}

type hashInformation struct {
	Hash         string            `json:"hash"`
	Information1 string            `json:"information1"`
	Information2 string            `json:"information2"`
	Information3 string            `json:"information3"`
	HashStatus   map[string]string `json:"hash_status"`
}

// ===============================================================
// Main
// ===============================================================
func main() {
	err := shim.Start(new(PartyChaincode))
	if err != nil {
		fmt.Printf("\nError starting Party chaincode: %s\n", err)
	}
}

// Init initializes chaincode
// ===========================
func (p *PartyChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

func (p *PartyChaincode) initLedger(APIstub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

// Invoke - Our entry point for Invocations
// ========================================
func (p *PartyChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Printf("\nInvoke: invoke is running "+function+" with parameters %s\n", args)

	// Handle different functions
	if function == "initLedger" {
		return p.initLedger(stub)
	} else if function == "generateHash" {
		return p.generateHash(stub, args)
	} else if function == "updateHashStatus" {
		return p.updateHashStatus(stub, args)
	} else if function == "getHashStatus" {
		return p.getHashStatus(stub, args)
	} else if function == "verifyHash" {
		return p.verifyHash(stub, args)
	}
	return shim.Error("Received unknown function invocation")
}

func calculateHash(information string) string {
	sum := sha256.Sum256([]byte(information))
	fmt.Printf("\nHash Sum: %x\n", sum)
	return hex.EncodeToString(sum[:])
}

// ==============================================================
// creatParty - create a new hash, store into chaincode state
// ==============================================================
func (p *PartyChaincode) generateHash(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Printf("\n-------------------------Generate Hash-------------------------\n")
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	type hashResp struct {
		Hash string `json:"hash"`
	}

	// ==== Input sanitation ====
	information1 := args[0]
	information2 := args[1]
	information3 := args[2]

	hash := calculateHash(information1 + information2 + information3)

	// ==== Check if hash already exists ====
	hashInfoAsBytes, err := stub.GetState(hash)
	if err != nil {
		fmt.Printf("\nError: %v\n", err)
		return shim.Error(err.Error())
	}
	if hashInfoAsBytes != nil {
		fmt.Printf("\nThis hash already exists: %s\n", hash)
		return shim.Error("This hash already exists: " + hash)
	}

	// ==== Create hash object and marshal to JSON ====
	hashInfo := hashInformation{hash, information1, information2, information3, map[string]string{}}

	fmt.Printf("\nhash structure created %v\n", hashInfo)

	hashJSONasBytes, err := json.Marshal(hashInfo)
	if err != nil {
		return shim.Error(err.Error())
	}

	// === Save hash to state ===
	err = stub.PutState(hash, hashJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	hashresp := hashResp{Hash: hash}
	hashRespJSONasBytes, err := json.Marshal(hashresp)
	if err != nil {
		return shim.Error(err.Error())
	}

	// ==== hash Created. Return success ====
	fmt.Printf("\n-------------------------End - Hash Generated-------------------------\n")
	return shim.Success(hashRespJSONasBytes)
}

// ===============================================
// updateHashStatus - update hash status
// ===============================================
func (p *PartyChaincode) updateHashStatus(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error
	var jsonResp string

	fmt.Printf("\n-------------------------Update Hash Status-------------------------\n")
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	// ==== Get the hash state ====
	fmt.Printf("get hash %s state: ", args[0])
	hashAsBytes, err := stub.GetState(args[0])
	if err != nil {
		fmt.Println("Failed to get state for " + args[0] + " Error: " + err.Error())
		return shim.Error("Failed to get state for " + args[0])
	} else if hashAsBytes == nil {
		jsonResp = "Hash does not exist: " + args[0]
		fmt.Printf("This hash does not exists: " + args[0])
		return shim.Error(jsonResp)
	}

	// ==== Unmarshal hash aka JSON.parse() ====
	hashInfo := hashInformation{}
	err = json.Unmarshal(hashAsBytes, &hashInfo)
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Printf("\nUpdating hash status %s\n", hashInfo)
	hashInfo.HashStatus[args[1]] = args[2]

	// ==== Marshal hash object ====
	hashJSONasBytes, err := json.Marshal(hashInfo)
	if err != nil {
		return shim.Error(err.Error())
	}

	// === Save hash to state ===
	err = stub.PutState(args[0], hashJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	// ==== Hash status updated. Return success ====
	fmt.Printf("\n-------------------------Hash Status Updated-------------------------\n")
	return shim.Success(nil)
}

// ===============================================
// getHashStatus - show hash status
// ===============================================
func (p *PartyChaincode) getHashStatus(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	var jsonResp string

	fmt.Printf("\n---------------------------Get Hash Status---------------------------\n")
	if len(args) != 1 {
		fmt.Printf("Incorrect number of arguments. Expecting 1")
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	type hashStatusResp struct {
		Hash   string            `json:"hash"`
		Status map[string]string `json:"status"`
	}

	// ==== Get the hash state ====
	fmt.Printf("get state of %s", args[0])
	hashInfoAsBytes, err := stub.GetState(args[0])
	if err != nil {
		jsonResp = "Failed to get state for " + args[0]
		return shim.Error(jsonResp)
	} else if hashInfoAsBytes == nil {
		jsonResp = "hash does not exist: " + args[0]
		return shim.Error(jsonResp)
	}

	hashInfo := hashInformation{}
	err = json.Unmarshal(hashInfoAsBytes, &hashInfo)
	if err != nil {
		return shim.Error(err.Error())
	}

	hashStatusRespVal := hashStatusResp{Hash: hashInfo.Hash, Status: hashInfo.HashStatus}
	hashStatusRespAsBytes, err := json.Marshal(hashStatusRespVal)
	if err != nil {
		return shim.Error(err.Error())
	}

	// ==== hash Created. Return success ====
	fmt.Printf("\n Returning %s\n", string(hashStatusRespAsBytes))
	fmt.Printf("\n-------------------------End - Get Hash Status-------------------------\n")
	return shim.Success(hashStatusRespAsBytes)
}

// ===============================================
// verifyHash - verify hash if exist
// ===============================================
func (p *PartyChaincode) verifyHash(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	var jsonResp, status string
	fmt.Printf("\n---------------------------Verify Hash---------------------------\n")
	if len(args) != 1 {
		fmt.Printf("Incorrect number of arguments. Expecting 1")
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	status = "NO"
	// ==== Get the hash state ====
	fmt.Printf("get state of %s", args[0])
	hashInfoAsBytes, err := stub.GetState(args[0])
	if err != nil {
		jsonResp = "Failed to get state for " + args[0]
		fmt.Printf("\n Error: %s", err.Error())
		return shim.Error(jsonResp)
	}
	if hashInfoAsBytes != nil {
		status = "YES"
	}
	fmt.Printf("\n-------------------------End - Verify Hash-------------------------\n")
	return shim.Success([]byte(status))
}
