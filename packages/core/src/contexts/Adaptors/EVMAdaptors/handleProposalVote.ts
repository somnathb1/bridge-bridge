import { Dispatch } from "react";
import { Event } from "ethers";
import { Bridge } from "@chainsafe/chainbridge-contracts";
import { BridgeConfig } from "../../../chainbridgeConfig";
import {
  AddMessageAction,
  ResetAction,
  TxIsDone,
} from "../../../reducers/TransitMessageReducer";
import { TransactionStatus } from "../../NetworkManagerContext";

const handleProposalVote = (
  destinationBridge: Bridge,
  homeChainConfig: BridgeConfig,
  depositNonce: string,
  depositVotes: number,
  tokensDispatch: Dispatch<AddMessageAction | ResetAction | TxIsDone>,
  setDepositVotes: (input: number) => void,
  transactionStatus?: TransactionStatus
) => {
  console.log("handleProposalVote: YO YO YO");
  // setDepositVotes(depositVotes + 1);

  // if(window.__RUNTIME_CONFIG__.)
  window.__RUNTIME_CONFIG__.destinationBridge = destinationBridge;
  window.__RUNTIME_CONFIG__.destinationBridge.mgr = {depositVotes, setDepositVotes};



  // destinationBridge.on("ProposalVote", console.log);
  // destinationBridge.on("ProposalVote", async (
  //   originDomainId: number,
  //   depositNonce: number,
  //   status: number,
  //   dataHash: string,
  //   tx: Event
  // ) => {console.log("Caught tx, status " + status); console.log(tx)});
  // destinationBridge.on(
  //   destinationBridge.filters.ProposalVote(null, null, null, null),
  //   async (
  //     originDomainId: number,
  //     depositNonce: number,
  //     status: number,
  //     dataHash: string,
  //     tx: Event
  //   ) => {

  //     console.log("handleProposalVote: ProposalVote YO YO");

  //     const txReceipt = await tx.getTransactionReceipt();
  //     if (status === 1) {
  //       setDepositVotes(depositVotes + 1);
  //     }

  //     if (transactionStatus === "Transfer Completed") {
  //       return tokensDispatch({
  //         type: "setTransactionIsDone",
  //       });
  //     }

  //     return tokensDispatch({
  //       type: "addMessage",
  //       payload: {
  //         address: String(txReceipt.from),
  //         signed: txReceipt.status === 1 ? "Confirmed" : "Rejected",
  //         order: parseFloat(
  //           `1.${txReceipt.transactionIndex}${depositVotes + 1}$`
  //         ),
  //         eventType: "Vote",
  //       },
  //     });
  //   }
  // );
};
export default handleProposalVote;
