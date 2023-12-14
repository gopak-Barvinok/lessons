import { HardhatUserConfig } from "hardhat/config";
import "hardhat/types"
import "@nomicfoundation/hardhat-toolbox";
import "./tasks/sample-tasks"
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";


const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0
    },
    user: {
      default: 1,
      1: 1
    }
  },
};

export default config;
