import { task, types } from 'hardhat/config';
import type { Demo } from "../typechain-types";
import { Demo__factory, } from '../typechain-types';

// Demo 0x5FbDB2315678afecb367f032d93F642f64180aa3

task("balance", "Displays balance")
//Обязательный параметр
.addParam('account', 'Account address')
//Необязательный параметр
.addOptionalParam("greeting", 
    "Greeting to print", 
    'Default greeting',
    types.string
)
.setAction(async ({account, greeting}, hre) => {
    //Выводится значение таска

    console.log(greeting);
    const balance = await hre.ethers.provider.getBalance(account);

    console.log(balance.toString());
})

task('callme', "Call demo func")
.addParam('contract', 'Contract address')
.addOptionalParam('account', 'Account name', 'deployer', types.string)
.setAction(async ({contract, account}, {ethers, getNamedAccounts}) => {
    const acc = (await getNamedAccounts())[account];

    //Подключение к контракту через signer
    const demo = Demo__factory.connect(
        contract,
        await ethers.getSigner(acc)
    );

    console.log(await demo.callme());
})

task('pay', "Call pay func")
.addParam('value', 'Value to send', 0 , types.int)
.addOptionalParam('account', 'Account name', 'deployer', types.string)
.setAction(async ({value, account}, {ethers, getNamedAccounts}) => {
    const acc = (await getNamedAccounts())[account];

    const demo = await ethers.getContract<Demo>('Demo', acc);

    const tx = await demo.pay(`Hello from ${acc}`, {value: value});
    await tx.wait();

    console.log(await demo.message());
    console.log((await ethers.provider.getBalance(demo.getAddress())).toString());
})

task('distribute', 'Distribute funds')
.addParam('addresses', 'Addresses to distribute to')
.setAction(async (taskArgs, {ethers}) => {
    const demo = await ethers.getContract<Demo>('Demo');

    const addrs = taskArgs.addresses.split(',');

    const tx = await demo.distribute(addrs)
    await tx.wait();

    //Ждём исполнение всех промисов
    await Promise.all(addrs.map(async (addr: string) => {
        console.log((await ethers.provider.getBalance(addr)).toString());
    }));
})