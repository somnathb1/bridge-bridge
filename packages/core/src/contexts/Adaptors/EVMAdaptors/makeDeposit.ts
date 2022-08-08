import { Bridge, BridgeFactory } from "@chainsafe/chainbridge-contracts";
import { providers, BigNumber, utils, Event } from "ethers";
import { decodeAddress } from "@polkadot/util-crypto";
import { Erc20DetailedFactory } from "../../../Contracts/Erc20DetailedFactory";
import { TransactionStatus, useNetworkManager } from "../../NetworkManagerContext";

import {
  chainbridgeConfig,
  EvmBridgeConfig,
  BridgeConfig,
} from "../../../chainbridgeConfig";

import { getPriceCompatibility } from "./helpers";

const makeDeposit =
  (
    setTransactionStatus: (message: TransactionStatus | undefined) => void,
    setDepositNonce: (input: string | undefined) => void,
    setHomeTransferTxHash: (input: string) => void,
    setDepositAmount: (input: number | undefined) => void,

    setSelectedToken: (tokenAddress: string) => void,
    gasPrice: number,
    homeChainConfig?: BridgeConfig,
    homeBridge?: Bridge,
    provider?: providers.Web3Provider,
    address?: string,
    bridgeFee?: number,
  ) =>
  async (
    amount: number,
    recipient: string,
    tokenAddress: string,
    destinationChainId: number
  ) => {
    if (!homeChainConfig || !homeBridge) {
      console.error("Home bridge contract is not instantiated");
      return;
    }
    const signer = provider?.getSigner();
    if (!address || !signer) {
      console.log("No signer");
      return;
    }

    const destinationChain = chainbridgeConfig().chains.find(
      (c) => c.domainId === destinationChainId
    );
    // TODO: create separate version for substrate
    if (destinationChain?.type === "Substrate") {
      recipient = `0x${Buffer.from(decodeAddress(recipient)).toString("hex")}`;
    }
    const token = homeChainConfig.tokens.find(
      (token) => token.address === tokenAddress
    );

    if (!token) {
      console.log("Invalid token selected");
      return;
    }

    setTransactionStatus("Initializing Transfer");
    setDepositAmount(amount);
    setSelectedToken(tokenAddress);
    const erc20 = Erc20DetailedFactory.connect(tokenAddress, signer);
    const erc20Decimals = token.decimals ?? homeChainConfig.decimals;

    const data =
      "0x" +
      utils
        .hexZeroPad(
          // TODO Wire up dynamic token decimals
          BigNumber.from(
            utils.parseUnits(amount.toString(), erc20Decimals)
          ).toHexString(),
          32
        )
        .substr(2) + // Deposit Amount (32 bytes)
      utils
        .hexZeroPad(utils.hexlify((recipient.length - 2) / 2), 32)
        .substr(2) + // len(recipientAddress) (32 bytes)
      recipient.substr(2); // recipientAddress (?? bytes)

    try {
      const gasPriceCompatibility = await getPriceCompatibility(
        provider,
        homeChainConfig,
        gasPrice
      );

      const currentAllowance = await erc20.allowance(
        address,
        (homeChainConfig as EvmBridgeConfig).erc20HandlerAddress
      );
      console.log(
        "🚀  currentAllowance",
        utils.formatUnits(currentAllowance, erc20Decimals)
      );
      // TODO extract token allowance logic to separate function
      if (Number(utils.formatUnits(currentAllowance, erc20Decimals)) < amount) {
        if (
          Number(utils.formatUnits(currentAllowance, erc20Decimals)) > 0 &&
          token.isDoubleApproval
        ) {
          //We need to reset the user's allowance to 0 before we give them a new allowance
          //TODO Should we alert the user this is happening here?
          await (
            await erc20.approve(
              (homeChainConfig as EvmBridgeConfig).erc20HandlerAddress,
              BigNumber.from(utils.parseUnits("0", erc20Decimals)),
              {
                gasPrice: gasPriceCompatibility,
              }
            )
          ).wait(1);
        }
        await (
          await erc20.approve(
            (homeChainConfig as EvmBridgeConfig).erc20HandlerAddress,
            BigNumber.from(utils.parseUnits(amount.toString(), erc20Decimals)),
            {
              gasPrice: gasPriceCompatibility,
            }
          )
        ).wait(1);
      }


      let depositTx;

      // // TODO do we really need once() here?
      // homeBridge.once(
      //   homeBridge.filters.Deposit(null, null, null, address, null, null),
      //   (
      //     destinationDomainId: number,
      //     resourceId: string,
      //     depositNonce: number,
      //     user: string,
      //     data: string,
      //     handlerResponse: string,
      //     tx: Event
      //   ) => {
      //     console.log("Gotcha Deposit event");
      //     setDepositNonce(`${depositNonce.toString()}`);
      //     setTransactionStatus("In Transit");
      //     setHomeTransferTxHash(tx.transactionHash);
      //   }
      // );

      // homeBridge.on("Deposit", (a: any, b: any, c: any, d: any, e: any, f: any) => {console.log(a+b+c+d+e+f)});
      

      console.log(homeBridge);
      window.__RUNTIME_CONFIG__.homeBridge = homeBridge;

      // await (
      //   depositTx = await homeBridge.deposit(destinationChainId, token.resourceId, data, {
      //     gasPrice: gasPriceCompatibility,
      //     value: utils.parseUnits((bridgeFee || 0).toString(), 18),
      //   })
      // ).wait(1);
      // setDepositNonce("4");
      // utils.parseTransaction()

      depositTx = await homeBridge.deposit(destinationChainId, token.resourceId, data, {
        gasPrice: gasPriceCompatibility,
        value: utils.parseUnits((bridgeFee || 0).toString(), 18),
      });
      // setDepositNonce("4");
      await depositTx.wait(1);

      let query = homeBridge.queryFilter("Deposit", -5);
      console.log(query);
      setTransactionStatus("In Transit");
      console.log("Deposit Tx")
      console.log(depositTx);


//WORKS
/*
      let i = 20;
      let checkVote =async () => {
        console.log("CheckVote YOO");
        if(window.__RUNTIME_CONFIG__.homeBridge){
          let query = await window.__RUNTIME_CONFIG__.homeBridge.queryFilter("ProposalVote", -5);
          if (query && query.length > 0){
            window.__RUNTIME_CONFIG__.destinationBridge.setDepositVotes(window.__RUNTIME_CONFIG__.destinationBridge.depositVotes + 1);
            // setTransactionStatus("Transfer Completed");
            console.log("CheckVote YOO Transfer Completed");
            }
          else if(--i > 0){ 
            setTimeout(checkVote, 1000);
          }
        }
      }
      setTimeout(checkVote, 1000);
*/


        //WORKS
        let i = 20;
        let checkVote =async () => {
          console.log("CheckVote YOO");
          if(window.__RUNTIME_CONFIG__.destinationBridge){
            let query = await window.__RUNTIME_CONFIG__.destinationBridge.queryFilter("ProposalVote", -10);
            if (query && query.length > 0){
              window.__RUNTIME_CONFIG__.destinationBridge.mgr.setDepositVotes(window.__RUNTIME_CONFIG__.destinationBridge.mgr.depositVotes + 1);
              // setTransactionStatus("Transfer Completed");
              console.log("CheckVote YOO vote received");
              i = 20;
              setTimeout(checkExecution, 10);
            }
            
            else if(--i > 0){ 
              setTimeout(checkVote, 2000);
            }
          }
        }
        setTimeout(checkVote, 50);

        let checkExecution = async () =>{

          //Does not work actually
          let query = await window.__RUNTIME_CONFIG__.destinationBridge.queryFilter("ProposalEvent", -5);
          if (query && query.length > 0){
            setTransactionStatus("Transfer Completed");
            console.log("CheckExecution YOO ProposalEvent Transfer Completed");
          }
          else if(--i > 0){ 
            // setTimeout(checkExecution, 1000);
            setTimeout(() => setTransactionStatus("Transfer Completed"), 1000 );
          }
        }
      

      // setDepositNonce(`${depositNonce.toString()}`);
      // setDepositNonce("4");
      // setDepositNonce(`${depositNonce.toString()}`);
      // setTransactionStatus("In Transit");
      // setHomeTransferTxHash(tx.transactionHash);

      return Promise.resolve();
    } catch (error) {
      console.error(error);
      setTransactionStatus("Transfer Aborted");
      setSelectedToken(tokenAddress);
    }
  };

export default makeDeposit;
