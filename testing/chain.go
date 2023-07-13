package ibctesting

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	errorsmod "cosmossdk.io/errors"
	sdkmath "cosmossdk.io/math"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/codec"
	"github.com/cosmos/cosmos-sdk/crypto/keys/secp256k1"
	cryptotypes "github.com/cosmos/cosmos-sdk/crypto/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	banktypes "github.com/cosmos/cosmos-sdk/x/bank/types"
	"github.com/cosmos/cosmos-sdk/x/staking/testutil"
	stakingtypes "github.com/cosmos/cosmos-sdk/x/staking/types"

	abci "github.com/cometbft/cometbft/abci/types"
	"github.com/cometbft/cometbft/crypto/tmhash"
	cmtproto "github.com/cometbft/cometbft/proto/tendermint/types"
	cmtprotoversion "github.com/cometbft/cometbft/proto/tendermint/version"
	cmttypes "github.com/cometbft/cometbft/types"
	cmtversion "github.com/cometbft/cometbft/version"

	capabilitykeeper "github.com/cosmos/ibc-go/modules/capability/keeper"
	capabilitytypes "github.com/cosmos/ibc-go/modules/capability/types"
	clienttypes "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	commitmenttypes "github.com/cosmos/ibc-go/v7/modules/core/23-commitment/types"
	host "github.com/cosmos/ibc-go/v7/modules/core/24-host"
	"github.com/cosmos/ibc-go/v7/modules/core/exported"
	"github.com/cosmos/ibc-go/v7/modules/core/types"
	ibctm "github.com/cosmos/ibc-go/v7/modules/light-clients/07-tendermint"
	"github.com/cosmos/ibc-go/v7/testing/simapp"
)

// NOTE: @alpe was massively helpful in determining how to solve the time problems in the SDK 50 upgrade.
// see discussion here: https://github.com/cosmos/ibc-go/pull/3883

var MaxAccounts = 10

type SenderAccount struct {
	SenderPrivKey cryptotypes.PrivKey
	SenderAccount sdk.AccountI
}

// TestChain is a testing struct that wraps a simapp with the last TM Header, the current ABCI
// header and the validators of the TestChain. It also contains a field called ChainID. This
// is the clientID that *other* chains use to refer to this TestChain. The SenderAccount
// is used for delivering transactions through the application state.
// NOTE: the actual application uses an empty chain-id for ease of testing.
type TestChain struct {
	testing.TB

	Coordinator   *Coordinator
	App           TestingApp
	ChainID       string
	LastHeader    *ibctm.Header   // header for last block height committed
	CurrentHeader cmtproto.Header // header for current block height
	QueryServer   types.QueryServer
	TxConfig      client.TxConfig
	Codec         codec.Codec

	Vals     *cmttypes.ValidatorSet
	NextVals *cmttypes.ValidatorSet

	// Signers is a map from validator address to the PrivValidator
	// The map is converted into an array that is the same order as the validators right before signing commit
	// This ensures that signers will always be in correct order even as validator powers change.
	// If a test adds a new validator after chain creation, then the signer map must be updated to include
	// the new PrivValidator entry.
	Signers map[string]cmttypes.PrivValidator

	// autogenerated sender private key
	SenderPrivKey cryptotypes.PrivKey
	SenderAccount sdk.AccountI

	SenderAccounts []SenderAccount

	// Short-term solution to override the logic of the standard SendMsgs function.
	// See issue https://github.com/cosmos/ibc-go/issues/3123 for more information.
	SendMsgsOverride func(msgs ...sdk.Msg) (*abci.ExecTxResult, error)
}

// NewTestChainWithValSet initializes a new TestChain instance with the given validator set
// and signer array. It also initializes 10 Sender accounts with a balance of 10000000000000000000 coins of
// bond denom to use for tests.
//
// The first block height is committed to state in order to allow for client creations on
// counterparty chains. The TestChain will return with a block height starting at 2.
//
// Time management is handled by the Coordinator in order to ensure synchrony between chains.
// Each update of any chain increments the block header time for all chains by 5 seconds.
//
// NOTE: to use a custom sender privkey and account for testing purposes, replace and modify this
// constructor function.
//
// CONTRACT: Validator array must be provided in the order expected by Tendermint.
// i.e. sorted first by power and then lexicographically by address.
func NewTestChainWithValSet(tb testing.TB, coord *Coordinator, chainID string, valSet *cmttypes.ValidatorSet, signers map[string]cmttypes.PrivValidator) *TestChain {
	tb.Helper()
	genAccs := []authtypes.GenesisAccount{}
	genBals := []banktypes.Balance{}
	senderAccs := []SenderAccount{}

	// generate genesis accounts
	for i := 0; i < MaxAccounts; i++ {
		senderPrivKey := secp256k1.GenPrivKey()
		acc := authtypes.NewBaseAccount(senderPrivKey.PubKey().Address().Bytes(), senderPrivKey.PubKey(), uint64(i), 0)
		amount, ok := sdkmath.NewIntFromString("10000000000000000000")
		require.True(tb, ok)

		// add sender account
		balance := banktypes.Balance{
			Address: acc.GetAddress().String(),
			Coins:   sdk.NewCoins(sdk.NewCoin(sdk.DefaultBondDenom, amount)),
		}

		genAccs = append(genAccs, acc)
		genBals = append(genBals, balance)

		senderAcc := SenderAccount{
			SenderAccount: acc,
			SenderPrivKey: senderPrivKey,
		}

		senderAccs = append(senderAccs, senderAcc)
	}

	app := SetupWithGenesisValSet(tb, valSet, genAccs, chainID, sdk.DefaultPowerReduction, genBals...)

	// create current header and call begin block
	header := cmtproto.Header{
		ChainID: chainID,
		Height:  1,
		Time:    coord.CurrentTime.UTC(),
	}

	txConfig := app.GetTxConfig()

	// create an account to send transactions from
	chain := &TestChain{
		TB:             tb,
		Coordinator:    coord,
		ChainID:        chainID,
		App:            app,
		CurrentHeader:  header,
		QueryServer:    app.GetIBCKeeper(),
		TxConfig:       txConfig,
		Codec:          app.AppCodec(),
		Vals:           valSet,
		NextVals:       valSet,
		Signers:        signers,
		SenderPrivKey:  senderAccs[0].SenderPrivKey,
		SenderAccount:  senderAccs[0].SenderAccount,
		SenderAccounts: senderAccs,
	}

	coord.CommitBlock(chain)

	return chain
}

// NewTestChain initializes a new test chain with a default of 4 validators
// Use this function if the tests do not need custom control over the validator set
func NewTestChain(t *testing.T, coord *Coordinator, chainID string) *TestChain {
	t.Helper()
	// generate validators private/public key
	var (
		validatorsPerChain = 4
		validators         []*cmttypes.Validator
		signersByAddress   = make(map[string]cmttypes.PrivValidator, validatorsPerChain)
	)

	for i := 0; i < validatorsPerChain; i++ {
		_, privVal := cmttypes.RandValidator(false, 100)
		pubKey, err := privVal.GetPubKey()
		require.NoError(t, err)
		validators = append(validators, cmttypes.NewValidator(pubKey, 1))
		signersByAddress[pubKey.Address().String()] = privVal
	}

	// construct validator set;
	// Note that the validators are sorted by voting power
	// or, if equal, by address lexical order
	valSet := cmttypes.NewValidatorSet(validators)

	return NewTestChainWithValSet(t, coord, chainID, valSet, signersByAddress)
}

// GetContext returns the current context for the application.
func (chain *TestChain) GetContext() sdk.Context {
	return chain.App.NewUncachedContext(false, chain.CurrentHeader)
}

// GetSimApp returns the SimApp to allow usage ofnon-interface fields.
// CONTRACT: This function should not be called by third parties implementing
// their own SimApp.
func (chain *TestChain) GetSimApp() *simapp.SimApp {
	app, ok := chain.App.(*simapp.SimApp)
	require.True(chain.TB, ok)

	return app
}

// QueryProof performs an abci query with the given key and returns the proto encoded merkle proof
// for the query and the height at which the proof will succeed on a tendermint verifier.
func (chain *TestChain) QueryProof(key []byte) ([]byte, clienttypes.Height) {
	return chain.QueryProofAtHeight(key, chain.App.LastBlockHeight())
}

// QueryProofAtHeight performs an abci query with the given key and returns the proto encoded merkle proof
// for the query and the height at which the proof will succeed on a tendermint verifier. Only the IBC
// store is supported
func (chain *TestChain) QueryProofAtHeight(key []byte, height int64) ([]byte, clienttypes.Height) {
	return chain.QueryProofForStore(exported.StoreKey, key, height)
}

// QueryProofForStore performs an abci query with the given key and returns the proto encoded merkle proof
// for the query and the height at which the proof will succeed on a tendermint verifier.
func (chain *TestChain) QueryProofForStore(storeKey string, key []byte, height int64) ([]byte, clienttypes.Height) {
	res, err := chain.App.Query(
		chain.GetContext().Context(),
		&abci.RequestQuery{
			Path:   fmt.Sprintf("store/%s/key", storeKey),
			Height: height - 1,
			Data:   key,
			Prove:  true,
		})
	require.NoError(chain.TB, err)

	merkleProof, err := commitmenttypes.ConvertProofs(res.ProofOps)
	require.NoError(chain.TB, err)

	proof, err := chain.App.AppCodec().Marshal(&merkleProof)
	require.NoError(chain.TB, err)

	revision := clienttypes.ParseChainID(chain.ChainID)

	// proof height + 1 is returned as the proof created corresponds to the height the proof
	// was created in the IAVL tree. Tendermint and subsequently the clients that rely on it
	// have heights 1 above the IAVL tree. Thus we return proof height + 1
	return proof, clienttypes.NewHeight(revision, uint64(res.Height)+1)
}

// QueryUpgradeProof performs an abci query with the given key and returns the proto encoded merkle proof
// for the query and the height at which the proof will succeed on a tendermint verifier.
func (chain *TestChain) QueryUpgradeProof(key []byte, height uint64) ([]byte, clienttypes.Height) {
	res, err := chain.App.Query(
		chain.GetContext().Context(),
		&abci.RequestQuery{
			Path:   "store/upgrade/key",
			Height: int64(height - 1),
			Data:   key,
			Prove:  true,
		})
	require.NoError(chain.TB, err)

	merkleProof, err := commitmenttypes.ConvertProofs(res.ProofOps)
	require.NoError(chain.TB, err)

	proof, err := chain.App.AppCodec().Marshal(&merkleProof)
	require.NoError(chain.TB, err)

	revision := clienttypes.ParseChainID(chain.ChainID)

	// proof height + 1 is returned as the proof created corresponds to the height the proof
	// was created in the IAVL tree. Tendermint and subsequently the clients that rely on it
	// have heights 1 above the IAVL tree. Thus we return proof height + 1
	return proof, clienttypes.NewHeight(revision, uint64(res.Height+1))
}

// QueryConsensusStateProof performs an abci query for a consensus state
// stored on the given clientID. The proof and consensusHeight are returned.
func (chain *TestChain) QueryConsensusStateProof(clientID string) ([]byte, clienttypes.Height) {
	clientState := chain.GetClientState(clientID)

	consensusHeight := clientState.GetLatestHeight().(clienttypes.Height)
	consensusKey := host.FullConsensusStateKey(clientID, consensusHeight)
	proofConsensus, _ := chain.QueryProof(consensusKey)

	return proofConsensus, consensusHeight
}

// NextBlock sets the last header to the current header and increments the current header to be
// at the next block height. It does not update the time as that is handled by the Coordinator.
// It will call FinalizeBlock and Commit and apply the validator set changes to the next validators
// of the next block being created. This follows the Tendermint protocol of applying valset changes
// returned on block `n` to the validators of block `n+2`.
// It calls BeginBlock with the new block created before returning.
func (chain *TestChain) NextBlock() {
	res, err := chain.App.FinalizeBlock(&abci.RequestFinalizeBlock{
		Height:             chain.CurrentHeader.Height,
		Time:               chain.CurrentHeader.GetTime(),
		NextValidatorsHash: chain.NextVals.Hash(),
	})
	require.NoError(chain.TB, err)
	chain.commitBlock(res)
}

func (chain *TestChain) commitBlock(res *abci.ResponseFinalizeBlock) {
	_, err := chain.App.Commit()
	require.NoError(chain.TB, err)

	// set the last header to the current header
	// use nil trusted fields
	chain.LastHeader = chain.CurrentTMClientHeader()

	// val set changes returned from previous block get applied to the next validators
	// of this block. See tendermint spec for details.
	chain.Vals = chain.NextVals
	chain.NextVals = ApplyValSetChanges(chain, chain.Vals, res.ValidatorUpdates)

	// increment the current header
	chain.CurrentHeader = cmtproto.Header{
		ChainID: chain.ChainID,
		Height:  chain.App.LastBlockHeight() + 1,
		AppHash: chain.App.LastCommitID().Hash,
		// NOTE: the time is increased by the coordinator to maintain time synchrony amongst
		// chains.
		Time:               chain.CurrentHeader.Time,
		ValidatorsHash:     chain.Vals.Hash(),
		NextValidatorsHash: chain.NextVals.Hash(),
		ProposerAddress:    chain.CurrentHeader.ProposerAddress,
	}
}

// sendMsgs delivers a transaction through the application without returning the result.
func (chain *TestChain) sendMsgs(msgs ...sdk.Msg) error {
	_, err := chain.SendMsgs(msgs...)
	return err
}

// SendMsgs delivers a transaction through the application. It updates the senders sequence
// number and updates the TestChain's headers. It returns the result and error if one
// occurred.
func (chain *TestChain) SendMsgs(msgs ...sdk.Msg) (*abci.ExecTxResult, error) {
	if chain.SendMsgsOverride != nil {
		return chain.SendMsgsOverride(msgs...)
	}

	// ensure the chain has the latest time
	chain.Coordinator.UpdateTimeForChain(chain)

	resp, err := simapp.SignAndDeliver(
		chain.TB,
		chain.TxConfig,
		chain.App.GetBaseApp(),
		msgs,
		chain.ChainID,
		[]uint64{chain.SenderAccount.GetAccountNumber()},
		[]uint64{chain.SenderAccount.GetSequence()},
		true,
		chain.CurrentHeader.GetTime(),
		chain.NextVals.Hash(),
		chain.SenderPrivKey,
	)
	if err != nil {
		return nil, err
	}

	// NextBlock calls app.Commit()
	chain.commitBlock(resp)

	require.Len(chain.TB, resp.TxResults, 1)
	txResult := resp.TxResults[0]

	if txResult.Code != 0 {
		return txResult, fmt.Errorf("%s/%d: %q", txResult.Codespace, txResult.Code, txResult.Log)
	}

	// increment sequence for successful transaction execution
	err = chain.SenderAccount.SetSequence(chain.SenderAccount.GetSequence() + 1)
	if err != nil {
		return nil, err
	}

	chain.Coordinator.IncrementTime()

	return txResult, nil
}

// GetClientState retrieves the client state for the provided clientID. The client is
// expected to exist otherwise testing will fail.
func (chain *TestChain) GetClientState(clientID string) exported.ClientState {
	clientState, found := chain.App.GetIBCKeeper().ClientKeeper.GetClientState(chain.GetContext(), clientID)
	require.True(chain.TB, found)

	return clientState
}

// GetConsensusState retrieves the consensus state for the provided clientID and height.
// It will return a success boolean depending on if consensus state exists or not.
func (chain *TestChain) GetConsensusState(clientID string, height exported.Height) (exported.ConsensusState, bool) {
	return chain.App.GetIBCKeeper().ClientKeeper.GetClientConsensusState(chain.GetContext(), clientID, height)
}

// GetValsAtHeight will return the validator set of the chain at a given height. It will return
// a success boolean depending on if the validator set exists or not at that height.
func (chain *TestChain) GetValsAtHeight(height int64) (*cmttypes.ValidatorSet, bool) {
	if height == chain.CurrentHeader.Height {
		return chain.Vals, true
	}

	histInfo, err := chain.App.GetStakingKeeper().GetHistoricalInfo(chain.GetContext(), height)
	if err != nil {
		fmt.Println(err)
		return nil, false
	}

	valSet := stakingtypes.Validators(histInfo.Valset)

	tmValidators, err := testutil.ToCmtValidators(valSet, sdk.DefaultPowerReduction)
	if err != nil {
		panic(err)
	}
	return cmttypes.NewValidatorSet(tmValidators), true
}

// GetAcknowledgement retrieves an acknowledgement for the provided packet. If the
// acknowledgement does not exist then testing will fail.
func (chain *TestChain) GetAcknowledgement(packet exported.PacketI) []byte {
	ack, found := chain.App.GetIBCKeeper().ChannelKeeper.GetPacketAcknowledgement(chain.GetContext(), packet.GetDestPort(), packet.GetDestChannel(), packet.GetSequence())
	require.True(chain.TB, found)

	return ack
}

// GetPrefix returns the prefix for used by a chain in connection creation
func (chain *TestChain) GetPrefix() commitmenttypes.MerklePrefix {
	return commitmenttypes.NewMerklePrefix(chain.App.GetIBCKeeper().ConnectionKeeper.GetCommitmentPrefix().Bytes())
}

// ConstructUpdateTMClientHeader will construct a valid 07-tendermint Header to update the
// light client on the source chain.
func (chain *TestChain) ConstructUpdateTMClientHeader(counterparty *TestChain, clientID string) (*ibctm.Header, error) {
	return chain.ConstructUpdateTMClientHeaderWithTrustedHeight(counterparty, clientID, clienttypes.ZeroHeight())
}

// ConstructUpdateTMClientHeader will construct a valid 07-tendermint Header to update the
// light client on the source chain.
func (chain *TestChain) ConstructUpdateTMClientHeaderWithTrustedHeight(counterparty *TestChain, clientID string, trustedHeight clienttypes.Height) (*ibctm.Header, error) {
	header := counterparty.LastHeader
	// Relayer must query for LatestHeight on client to get TrustedHeight if the trusted height is not set
	if trustedHeight.IsZero() {
		trustedHeight = chain.GetClientState(clientID).GetLatestHeight().(clienttypes.Height)
	}
	var (
		tmTrustedVals *cmttypes.ValidatorSet
		ok            bool
	)
	// Once we get TrustedHeight from client, we must query the validators from the counterparty chain
	// If the LatestHeight == LastHeader.Height, then TrustedValidators are current validators
	// If LatestHeight < LastHeader.Height, we can query the historical validator set from HistoricalInfo
	if trustedHeight == counterparty.LastHeader.GetHeight() {
		tmTrustedVals = counterparty.Vals
	} else {
		// NOTE: We need to get validators from counterparty at height: trustedHeight+1
		// since the last trusted validators for a header at height h
		// is the NextValidators at h+1 committed to in header h by
		// NextValidatorsHash
		tmTrustedVals, ok = counterparty.GetValsAtHeight(int64(trustedHeight.RevisionHeight + 1))
		if !ok {
			return nil, errorsmod.Wrapf(ibctm.ErrInvalidHeaderHeight, "could not retrieve trusted validators at trustedHeight: %d", trustedHeight)
		}
	}
	// inject trusted fields into last header
	// for now assume revision number is 0
	header.TrustedHeight = trustedHeight

	trustedVals, err := tmTrustedVals.ToProto()
	if err != nil {
		return nil, err
	}
	header.TrustedValidators = trustedVals

	return header, nil
}

// ExpireClient fast forwards the chain's block time by the provided amount of time which will
// expire any clients with a trusting period less than or equal to this amount of time.
func (chain *TestChain) ExpireClient(amount time.Duration) {
	chain.Coordinator.IncrementTimeBy(amount)
}

// CurrentTMClientHeader creates a TM header using the current header parameters
// on the chain. The trusted fields in the header are set to nil.
func (chain *TestChain) CurrentTMClientHeader() *ibctm.Header {
	return chain.CreateTMClientHeader(
		chain.ChainID,
		chain.CurrentHeader.Height,
		clienttypes.Height{},
		chain.CurrentHeader.Time,
		chain.Vals,
		chain.NextVals,
		nil,
		chain.Signers,
	)
}

// CreateTMClientHeader creates a TM header to update the TM client. Args are passed in to allow
// caller flexibility to use params that differ from the chain.
func (chain *TestChain) CreateTMClientHeader(chainID string, blockHeight int64, trustedHeight clienttypes.Height, timestamp time.Time, cmtValSet, nextVals, tmTrustedVals *cmttypes.ValidatorSet, signers map[string]cmttypes.PrivValidator) *ibctm.Header {
	var (
		valSet      *cmtproto.ValidatorSet
		trustedVals *cmtproto.ValidatorSet
	)
	require.NotNil(chain.TB, cmtValSet)

	tmHeader := cmttypes.Header{
		Version:            cmtprotoversion.Consensus{Block: cmtversion.BlockProtocol, App: 2},
		ChainID:            chainID,
		Height:             blockHeight,
		Time:               timestamp,
		LastBlockID:        MakeBlockID(make([]byte, tmhash.Size), 10_000, make([]byte, tmhash.Size)),
		LastCommitHash:     chain.App.LastCommitID().Hash,
		DataHash:           tmhash.Sum([]byte("data_hash")),
		ValidatorsHash:     cmtValSet.Hash(),
		NextValidatorsHash: nextVals.Hash(),
		ConsensusHash:      tmhash.Sum([]byte("consensus_hash")),
		AppHash:            chain.CurrentHeader.AppHash,
		LastResultsHash:    tmhash.Sum([]byte("last_results_hash")),
		EvidenceHash:       tmhash.Sum([]byte("evidence_hash")),
		ProposerAddress:    cmtValSet.Proposer.Address, //nolint:staticcheck
	}

	hhash := tmHeader.Hash()
	blockID := MakeBlockID(hhash, 3, tmhash.Sum([]byte("part_set")))
	voteSet := cmttypes.NewExtendedVoteSet(chainID, blockHeight, 1, cmtproto.PrecommitType, cmtValSet)

	// MakeCommit expects a signer array in the same order as the validator array.
	// Thus we iterate over the ordered validator set and construct a signer array
	// from the signer map in the same order.
	var signerArr []cmttypes.PrivValidator   //nolint:prealloc // using prealloc here would be needlessly complex
	for _, v := range cmtValSet.Validators { //nolint:staticcheck // need to check for nil validator set
		signerArr = append(signerArr, signers[v.Address.String()])
	}

	extCommit, err := cmttypes.MakeExtCommit(blockID, blockHeight, 1, voteSet, signerArr, timestamp, true)
	require.NoError(chain.TB, err)

	signedHeader := &cmtproto.SignedHeader{
		Header: tmHeader.ToProto(),
		Commit: extCommit.ToCommit().ToProto(),
	}

	if cmtValSet != nil { //nolint:staticcheck
		valSet, err = cmtValSet.ToProto()
		require.NoError(chain.TB, err)
	}

	if tmTrustedVals != nil {
		trustedVals, err = tmTrustedVals.ToProto()
		require.NoError(chain.TB, err)
	}

	// The trusted fields may be nil. They may be filled before relaying messages to a client.
	// The relayer is responsible for querying client and injecting appropriate trusted fields.
	return &ibctm.Header{
		SignedHeader:      signedHeader,
		ValidatorSet:      valSet,
		TrustedHeight:     trustedHeight,
		TrustedValidators: trustedVals,
	}
}

// MakeBlockID copied unimported test functions from cmttypes to use them here
func MakeBlockID(hash []byte, partSetSize uint32, partSetHash []byte) cmttypes.BlockID {
	return cmttypes.BlockID{
		Hash: hash,
		PartSetHeader: cmttypes.PartSetHeader{
			Total: partSetSize,
			Hash:  partSetHash,
		},
	}
}

// CreatePortCapability binds and claims a capability for the given portID if it does not
// already exist. This function will fail testing on any resulting error.
// NOTE: only creation of a capability for a transfer or mock port is supported
// Other applications must bind to the port in InitGenesis or modify this code.
func (chain *TestChain) CreatePortCapability(scopedKeeper capabilitykeeper.ScopedKeeper, portID string) {
	// check if the portId is already binded, if not bind it
	_, ok := chain.App.GetScopedIBCKeeper().GetCapability(chain.GetContext(), host.PortPath(portID))
	if !ok {
		// create capability using the IBC capability keeper
		capability, err := chain.App.GetScopedIBCKeeper().NewCapability(chain.GetContext(), host.PortPath(portID))
		require.NoError(chain.TB, err)

		// claim capability using the scopedKeeper
		err = scopedKeeper.ClaimCapability(chain.GetContext(), capability, host.PortPath(portID))
		require.NoError(chain.TB, err)
	}

	chain.NextBlock()
}

// GetPortCapability returns the port capability for the given portID. The capability must
// exist, otherwise testing will fail.
func (chain *TestChain) GetPortCapability(portID string) *capabilitytypes.Capability {
	capability, ok := chain.App.GetScopedIBCKeeper().GetCapability(chain.GetContext(), host.PortPath(portID))
	require.True(chain.TB, ok)

	return capability
}

// CreateChannelCapability binds and claims a capability for the given portID and channelID
// if it does not already exist. This function will fail testing on any resulting error. The
// scoped keeper passed in will claim the new capability.
func (chain *TestChain) CreateChannelCapability(scopedKeeper capabilitykeeper.ScopedKeeper, portID, channelID string) {
	capName := host.ChannelCapabilityPath(portID, channelID)
	// check if the portId is already binded, if not bind it
	_, ok := chain.App.GetScopedIBCKeeper().GetCapability(chain.GetContext(), capName)
	if !ok {
		capability, err := chain.App.GetScopedIBCKeeper().NewCapability(chain.GetContext(), capName)
		require.NoError(chain.TB, err)
		err = scopedKeeper.ClaimCapability(chain.GetContext(), capability, capName)
		require.NoError(chain.TB, err)
	}

	chain.NextBlock()
}

// GetChannelCapability returns the channel capability for the given portID and channelID.
// The capability must exist, otherwise testing will fail.
func (chain *TestChain) GetChannelCapability(portID, channelID string) *capabilitytypes.Capability {
	capability, ok := chain.App.GetScopedIBCKeeper().GetCapability(chain.GetContext(), host.ChannelCapabilityPath(portID, channelID))
	require.True(chain.TB, ok)

	return capability
}

// GetTimeoutHeight is a convenience function which returns a IBC packet timeout height
// to be used for testing. It returns the current IBC height + 100 blocks
func (chain *TestChain) GetTimeoutHeight() clienttypes.Height {
	return clienttypes.NewHeight(clienttypes.ParseChainID(chain.ChainID), uint64(chain.GetContext().BlockHeight())+100)
}
