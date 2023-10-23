import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();

  const ERC20 = await ethers.getContractFactory("MShop", signer);
  const erc = await ERC20.deploy();
  await erc.waitForDeployment();
  console.log(await erc.getAddress());
  console.log(await erc.token());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
