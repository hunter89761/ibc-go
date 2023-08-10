package keeper

/*
	This file is to allow for unexported functions to be accessible to the testing package.
*/

import (
	sdk "github.com/cosmos/cosmos-sdk/types"

	clienttypes "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	"github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
)

// StartFlushUpgradeHandshake is a wrapper around startFlushUpgradeHandshake to allow the function to be directly called in tests.
func (k Keeper) StartFlushUpgradeHandshake(
	ctx sdk.Context,
	portID,
	channelID string,
	proposedUpgradeFields types.UpgradeFields,
	counterpartyChannel types.Channel,
	counterpartyUpgrade types.Upgrade,
	proofCounterpartyChannel,
	proofCounterpartyUpgrade []byte,
	proofHeight clienttypes.Height,
) error {
	return k.startFlushUpgradeHandshake(ctx, portID, channelID, proposedUpgradeFields, counterpartyChannel, counterpartyUpgrade, proofCounterpartyChannel, proofCounterpartyUpgrade, proofHeight)
}

// ValidateSelfUpgradeFields is a wrapper around validateSelfUpgradeFields to allow the function to be directly called in tests.
func (k Keeper) ValidateSelfUpgradeFields(ctx sdk.Context, proposedUpgrade types.UpgradeFields, currentChannel types.Channel) error {
	return k.validateSelfUpgradeFields(ctx, proposedUpgrade, currentChannel)
}