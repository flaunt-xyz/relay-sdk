import { BigNumber, ethers, providers } from "ethers";

import { DEFAULT_DEADLINE_GAP } from "../constants";
import {
  SponsoredCallERC2771Request,
  SponsoredCallERC2771RequestOptionalParameters,
} from "../lib/erc2771/types";

import { calculateDeadline } from "./calculateDeadline";
import { getUserNonce } from "./getUserNonce";

export const populateOptionalUserParameters = async <
  Request extends SponsoredCallERC2771Request,
  OptionalParameters extends SponsoredCallERC2771RequestOptionalParameters
>(
  request: Request,
  provider: providers.Web3Provider | ethers.providers.Provider
): Promise<Partial<OptionalParameters>> => {
  const parametersToOverride: Partial<OptionalParameters> = {};
  if (!request.userDeadline) {
    parametersToOverride.userDeadline = calculateDeadline(DEFAULT_DEADLINE_GAP);
  }
  if (!request.userNonce) {
    parametersToOverride.userNonce = BigNumber.from(
      (
        (await getUserNonce(request.user as string, provider)) as BigNumber
      ).toNumber()
    ).toString();
  }

  return parametersToOverride;
};
