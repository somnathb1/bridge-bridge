window.__RUNTIME_CONFIG__ = {
  CHAINBRIDGE: {
    chains: [
      {
        domainId: 0,
        networkId: 13337,
        "name": "Telnyx-Zion",
        decimals: 18,
        bridgeAddress: "0xC9040C0Ec35102f94473f46D3C03044F9d014475",
        erc20HandlerAddress: "0xC111B240797a7110315DCEBaD78FC52461BaabB0",
        rpcUrl: "http://zion.telnyx.com/rpc",
        "type": "ethereum",
        nativeTokenSymbol: "TNX",
        tokens: [
          {
            address: "0x13A9f0Ba381AbAC7264E44a0Ddb4A6643974598b",
            name: "Wrapped Telnyx",
            symbol: "WTNX",
            imageUri: "WETHIcon",
            resourceId:
              "0x23e7094DADda15810F191DD6AcF7E4FFa37571e4e7094DADda15810F191DD6A",
          },
        ],
      },
      {
        domainId: 1,
        networkId: 43113,
        name: "Avalanche - Fuji testnet",
        decimals: 18,
        bridgeAddress: "0x5FAA5B56b5e5B9c257A639dFb5Ae7dBA559d905b",
        erc20HandlerAddress: "0x1dba0f44B1188E957B2e1a576498dEb7Ff6208E6",
        rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
        type: "Ethereum",
        nativeTokenSymbol: "AVAX",
        tokens: [
          {
            address: "0x64CE3B7C19eac37a0904336D468dC3482d568fa7",
            name: "Wrapped Telnyx",
            symbol: "WTNX",
            imageUri: "WETHIcon",
            resourceId:
              "0x23e7094DADda15810F191DD6AcF7E4FFa37571e4e7094DADda15810F191DD6A",
          },
        ],
      },
    ],
  },
};
