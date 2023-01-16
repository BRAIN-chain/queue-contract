require("@nomicfoundation/hardhat-toolbox");

require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './contracts',
  },
  defaultNetwork: 'localhost',

  // gasReporter: {
  //   currency: 'USD',
  //   gasPrice: <PRICE>
  // }
  gasReporter: {
    enabled: true
  },

  networks: {
    hardhat: {
      forking: {
        enabled: true,
        url: 'https://rpc.ankr.com/polygon_mumbai',
      },
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    mumbai: {
      url: 'https://rpc.ankr.com/polygon_mumbai',
    },
  },
};
