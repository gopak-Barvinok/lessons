import { expect } from "chai";
import { ethers, deployments, network } from 'hardhat';
import { Demo, Governance } from '../typechain-types';
import { AbiCoder, solidityPackedKeccak256 } from "ethers";

describe('MShop', function() {
  let governance: Governance;
  let demo: Demo;
  const abiEncoder = AbiCoder.defaultAbiCoder();

  beforeEach(async () => {
    await deployments.fixture(['MyToken' ,'Governance', 'Demo']);

    governance = await ethers.getContract<Governance>('Governance');
    demo = await ethers.getContract<Demo>('Demo');
  });

  it("works", async function() {
    const proposeTx = await governance.propose(
      demo.getAddress(),
      10,
      "pay(string)",
      abiEncoder.encode(['string'], ['test']),
      "Sample proposal"
    );

    const proposalData = await proposeTx.wait();


    const proposalId = proposalData!.logs[0].data;


    const senderTx = await ethers.provider.getSigner(0)
    const sendTx = await senderTx.sendTransaction({
      to: governance.getAddress(),
      value: 10
    });
    await sendTx.wait();

    await network.provider.send("evm_increaseTime", [11]);

    const voteTx = await governance.vote(proposalId, 1);
    await voteTx.wait();

    await network.provider.send("evm_increaseTime", [70]);
    const executeTx = await governance.execute(
      demo.getAddress(),
      10,
      "pay(string)",
      abiEncoder.encode(['string'], ['test']),
      solidityPackedKeccak256(['string'], ["Sample proposal"])
    );

    await executeTx.wait();

    expect(await demo.message()).to.eq("test");
    expect(await demo.balances(governance.getAddress())).to.eq(10);
  });
});