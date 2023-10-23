import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("Lock", function () {
    async function dep() {
        const [deployer] = await ethers.getSigners();

        const NFTFactory = await ethers.getContractFactory("MyToken");
        const token = await upgrades.deployProxy(NFTFactory, [deployer.address], {
            initializer: 'initialize',
            kind: 'uups',
        });
        await token.waitForDeployment()

        return {token, deployer};
    }
 
    it('works', async () => {
        const {token, deployer} = await loadFixture(dep);

        const mintTx = await token.safeMint(deployer.address, "123abs");
        await mintTx.wait()

        expect(await token.balanceOf(deployer.address)).to.eq(1);

        const NFTFactoryV2 = await ethers.getContractFactory("MyTokenV2");
        const token2 = await upgrades.upgradeProxy(token, NFTFactoryV2)
        
        expect(await token.balanceOf(deployer.address)).to.eq(1);
        expect(await token2.demo()).to.be.true;
    });
});
