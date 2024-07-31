import { EndpointId } from '@layerzerolabs/lz-definitions'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const sepoliaContract: OmniPointHardhat = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'BrenkibERC20',
}

const arbContract: OmniPointHardhat = {
    eid: EndpointId.ARBSEP_V2_TESTNET,
    contractName: 'BrenkibERC20',
}

const config: OAppOmniGraphHardhat = {
    contracts: [
        {
            contract: sepoliaContract,
        },
        {
            contract: arbContract,
        },
    ],
    connections: [
        {
            from: sepoliaContract,
            to: arbContract,
        },
        {
            from: arbContract,
            to: sepoliaContract,
        },
    ],
}

export default config
