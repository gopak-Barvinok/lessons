import {expect} from "chai";
import {ethers} from "hardhat";

describe("LibDemo", () => {
    let owner: any;
    let libDemo: any;
    let strExt: any;
    let arrayExt: any;

    beforeEach(async () => {
        [owner] = await ethers.getSigners();

        const LibDemo = await ethers.getContractFactory("LibDemo", owner);
        libDemo = await LibDemo.deploy();
        await libDemo.waitForDeployment();

    })

    it("compares string", async function() {
        const resultTrue = await libDemo.runnerStr("cat", "cat");
        expect(resultTrue).to.eq(true);

        const resultFalse = await libDemo.runnerStr("cat", "cats");
        expect(resultFalse).to.eq(false);
    })
    
    it("finds uint in array", async function() {
        const resultTrue = await libDemo.runnerArr([1, 2, 3, 4, 5], 2);
        expect(resultTrue).to.eq(true);

        const resultFalse = await libDemo.runnerArr([1, 2, 3, 4, 5], 0);
        expect(resultFalse).to.eq(false);
    })

})