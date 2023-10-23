import { expect } from "chai";
import { ethers } from "hardhat";
const tokenJSON = require("../artifacts/contracts/ERC20.sol/MCSToken.json");

describe("MShop", () => {
    let owner: any;
    let buyer: any;
    let shop: any;
    let erc20: any;

    beforeEach(async () => {
        [owner, buyer] = await ethers.getSigners();

        const MShop = await ethers.getContractFactory("MShop", owner);
        shop = await MShop.deploy();
        shop.waitForDeployment();

        erc20 = new ethers.Contract(await shop.token(), tokenJSON.abi, owner);
    })

    it("should have an owner and a token", async () => {
        expect(await shop.owner()).to.eq(owner.address);

        // Должен содержаться какой-то адрес
        expect(await shop.token()).to.be.properAddress;
    })

    it("allows to buy", async () => {
        const tokenAmount = 3;

        const txData = {
            value: tokenAmount,
            to: shop
        }

        const tx = await buyer.sendTransaction(txData);
        await tx.wait();

        expect(await erc20.balanceOf(buyer)).to.eq(tokenAmount);
        await expect(() => tx).to.changeEtherBalance(shop, tokenAmount);
        await expect(tx).to.emit(shop, "Bought").withArgs(tokenAmount, buyer.address);
    
    })

    it("allows to sell", async () => {
        const tx = await buyer.sendTransaction({
            value: 3,
            to: shop
        });
        await tx.wait();

        const sellAmount = 2;

        const approval = await erc20.connect(buyer).approve(shop, sellAmount);
        await approval.wait();
        
        const sellTx = await shop.connect(buyer).sell(sellAmount);

        expect(await erc20.balanceOf(buyer)).to.eq(1);
        await expect(() => sellTx).to.changeEtherBalance(shop, -sellAmount);
        await expect(sellTx).to.emit(shop, "Sold").withArgs(sellAmount, buyer.address);
    })
})