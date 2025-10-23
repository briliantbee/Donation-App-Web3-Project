import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CBVME5G2Z3ELGQ3FHKG2SR33DUSODT4G33MLN2SNFG64S7YWOWFDZTGW",
    }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAACERvbmF0aW9uAAAAAwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAVkb25vcgAAAAAAABMAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAY=",
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAA=",
            "AAAAAAAAAAAAAAAGZG9uYXRlAAAAAAACAAAAAAAAAAVkb25vcgAAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
            "AAAAAAAAAAAAAAAQZ2V0X3RvdGFsX3JhaXNlZAAAAAAAAAABAAAACw==",
            "AAAAAAAAAAAAAAANZ2V0X3JlY2lwaWVudAAAAAAAAAAAAAABAAAAEw==",
            "AAAAAAAAAAAAAAANZ2V0X2RvbmF0aW9ucwAAAAAAAAAAAAABAAAD6gAAB9AAAAAIRG9uYXRpb24=",
            "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAABAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAQAAAAs="]), options);
        this.options = options;
    }
    fromJSON = {
        initialize: (this.txFromJSON),
        donate: (this.txFromJSON),
        get_total_raised: (this.txFromJSON),
        get_recipient: (this.txFromJSON),
        get_donations: (this.txFromJSON),
        withdraw: (this.txFromJSON)
    };
}
