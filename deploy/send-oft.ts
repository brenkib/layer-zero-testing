import { task } from 'hardhat/config'

import { EndpointId } from '@layerzerolabs/lz-definitions'
import { Options } from '@layerzerolabs/lz-v2-utilities'

const CONTRACT_ADDRESS_SEPOLIA = '0x6ccA6E0943277780da2D9C0bb7e863B6Dbf36B05'
// eslint-disable-next-line import/order
import contract from '../artifacts/contracts/BrenkibERC20.sol/BrenkibERC20.json'
const ABI = contract.abi

const ENDPOINTID_SENDER = EndpointId.ARBSEP_V2_TESTNET
const ENDPOINTID_RECIVER = EndpointId.SEPOLIA_V2_TESTNET

import arbDeployment from '../deployments/arbsepolia/BrenkibERC20.json'
import sepoliaDeployment from '../deployments/sepolia/BrenkibERC20.json'

// eslint-disable-next-line import/order
import { createGetHreByEid, createProviderFactory } from '@layerzerolabs/devtools-evm-hardhat'

type Deployment = typeof sepoliaDeployment
type Network = 'arbsepolia' | 'sepolia'
const deployments: Record<Network, Deployment> = {
    arbsepolia: arbDeployment,
    sepolia: sepoliaDeployment,
}

task('send-oft', 'Mints new NFT to an account').setAction(async (taskArgs, { ethers, getNamedAccounts }) => {
    const [owner] = await ethers.getSigners()
    console.log('Owner: ', owner.address)

    const contractA = deployments.arbsepolia
    const environmentFactory = createGetHreByEid()
    const providerFactory = createProviderFactory(environmentFactory)
    const signer = (await providerFactory(ENDPOINTID_SENDER)).getSigner()

    const oappContractFactory = await ethers.getContractFactory('BrenkibERC20', signer)
    const oapp = oappContractFactory.attach(contractA.address)

    const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex().toString()
    const tokensToSend = ethers.utils.parseEther('1000000000000000000') // 1

    const ownerA = await signer.getAddress()
    const ownerB = ownerA
    const sendParam = [
        ENDPOINTID_RECIVER,
        ethers.utils.zeroPad(ownerB, 32),
        tokensToSend,
        tokensToSend,
        options,
        '0x',
        '0x',
    ]

    // Fetching the native fee for the token send operation
    const [nativeFee] = await oapp.quoteSend(sendParam, false)
    console.log('native fee:', nativeFee)

    const r = await oapp.send(sendParam, [nativeFee, 0], ownerA, { gasLimit: 200000, value: nativeFee })

    console.log(`Tx initiated. See: https://layerzeroscan.com/tx/${r.hash}`)

    await r.wait()

    /*const contract1 = new ethers.Contract(CONTRACT_ADDRESS_SEPOLIA, ABI, owner)
    // Defining the amount of tokens to send and constructing the parameters for the send operation
    const tokensToSend = ethers.utils.parseEther('1000000000000000000') // 1

    // Defining extra message execution options for the send operation
    const options = Options.newOptions().addExecutorLzReceiveOption(2000000, 0).toHex().toString()
    const toAddressBytes = ethers.utils.defaultAbiCoder.encode(['address'], [owner.address])

    const sendParam = [ENDPOINTID_RECIVER, toAddressBytes, tokensToSend, tokensToSend, options, '0x', '0x']

    // Fetching the native fee for the token send operation
    const [nativeFee] = await contract1.quoteSend(sendParam, false)

    console.log('FEE', nativeFee.toString())

    // Executing the send operation from myOFTA contract
    const tx = await contract1.send(sendParam, [nativeFee.toString(), 0], owner.address, {
        gasLimit: 2000000,
        value: nativeFee.toString(),
    })
    await tx.wait()

    console.log('SENDED', tx.hash)

    // Fetching the final token balances of ownerA and ownerB
    const finalBalanceA = await contract1.balanceOf(owner.address)
    console.log('Sepolia balance', finalBalanceA.toString())*/
})
