import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";


const config: HardhatUserConfig = {
  solidity: "0.8.19",
  namedAccounts: {
    deployer: {
      default: 0
    }
  }
};

export default config;
