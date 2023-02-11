require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli:{
      url: process.env.Goerli_URL,
      accounts:[process.env.private_key_Acount]
    }
  },
  etherscan:{
    apiKey:process.env.Api_Key_Goerli
  }
};

