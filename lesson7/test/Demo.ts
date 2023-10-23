import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture }  from "@nomicfoundation/hardhat-network-helpers";

describe("Demo", () => {

    async function deployFixture() {
        const [owner, otherAddr] = await ethers.getSigners();
        const DemoContract = await ethers.getContractFactory("Demo", owner);
        const demo = await DemoContract.deploy();
        await demo.waitForDeployment();

        return {demo, owner, otherAddr};
    }

    async function sendMoney(sender: any, to: any) {
        const amount = 100;
        const txData = {to: to, value: amount}
        const tx = await sender.sendTransaction(txData);
        await tx.wait();

        return [tx, amount];
    }

    it("should allow to send money", async () => {
        const {demo, otherAddr} = await loadFixture(deployFixture);
        const [sendMoneyTx, amount] = await sendMoney(otherAddr, demo);

        await expect(() => sendMoneyTx).to.changeEtherBalance(demo, amount);

        //Узнаём block.timestamp;
        const timestamp = (await ethers.provider.getBlock(sendMoneyTx.blockNumber))!.timestamp;

        await expect(sendMoneyTx).to.emit(demo, "Paid").withArgs(otherAddr.address, amount, timestamp)
    })

    it("should allow owner to withdraw funds", async () => {
        const {demo, owner, otherAddr} = await loadFixture(deployFixture);
        const [_, amount] = await sendMoney(otherAddr, demo);

        const tx = await demo.withdraw(owner);
        await expect(() => tx).to.changeEtherBalances([demo, owner], [-amount, +amount]);
    })
    it("not allow to other accounts to withdraw funds", async () => {

    })
});
