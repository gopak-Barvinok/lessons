import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from 'hardhat/types';

export default async function deployDemo({
  deployments, 
  getNamedAccounts,}: HardhatRuntimeEnvironment): Promise<void> {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();

    log("------------------------------------------");
    log('Deploying Demo and waiting for confirmations');

    const demo = await deploy('Demo', {
      from: deployer,
      args: [],
      log: true,
      waitConfirmations: 1,
    });
    log(`Demo deployed at ${demo.address}`);
}

deployDemo.tags = ['all', 'demo'];