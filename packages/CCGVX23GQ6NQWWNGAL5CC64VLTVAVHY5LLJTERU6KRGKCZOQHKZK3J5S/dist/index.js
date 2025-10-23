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
        contractId: "CCGVX23GQ6NQWWNGAL5CC64VLTVAVHY5LLJTERU6KRGKCZOQHKZK3J5S",
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
        super(new ContractSpec(["AAAAAgAAAAAAAAAAAAAADkNhbXBhaWduU3RhdHVzAAAAAAADAAAAAAAAAAAAAAAGQWN0aXZlAAAAAAAAAAAAAAAAAAlDb21wbGV0ZWQAAAAAAAAAAAAAAAAAAAZDbG9zZWQAAA==",
            "AAAAAQAAAAAAAAAAAAAACENhbXBhaWduAAAACQAAAAAAAAAIY2F0ZWdvcnkAAAAQAAAAAAAAAApjcmVhdGVkX2F0AAAAAAAGAAAAAAAAAA5jdXJyZW50X2Ftb3VudAAAAAAACwAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAAAAAACaWQAAAAAAAQAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAABnN0YXR1cwAAAAAH0AAAAA5DYW1wYWlnblN0YXR1cwAAAAAAAAAAAA10YXJnZXRfYW1vdW50AAAAAAAACwAAAAAAAAAFdGl0bGUAAAAAAAAQ",
            "AAAAAQAAAAAAAAAAAAAACERvbmF0aW9uAAAAAwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAVkb25vcgAAAAAAABMAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAY=",
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAAAAAAA=",
            "AAAAAAAAAAAAAAAPY3JlYXRlX2NhbXBhaWduAAAAAAUAAAAAAAAABXRpdGxlAAAAAAAAEAAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAAAAAAIY2F0ZWdvcnkAAAAQAAAAAAAAAA10YXJnZXRfYW1vdW50AAAAAAAACwAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAEAAAAE",
            "AAAAAAAAAAAAAAATZ2V0X3RvdGFsX2RvbmF0aW9ucwAAAAAAAAAAAQAAAAs=",
            "AAAAAAAAAAAAAAANZ2V0X2NhbXBhaWducwAAAAAAAAAAAAABAAAD6gAAB9AAAAAIQ2FtcGFpZ24=",
            "AAAAAAAAAAAAAAAMZ2V0X2NhbXBhaWduAAAAAQAAAAAAAAACaWQAAAAAAAQAAAABAAAH0AAAAAhDYW1wYWlnbg==",
            "AAAAAAAAAAAAAAAGZG9uYXRlAAAAAAADAAAAAAAAAAJpZAAAAAAABAAAAAAAAAAFZG9ub3IAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
            "AAAAAAAAAAAAAAANZ2V0X2RvbmF0aW9ucwAAAAAAAAEAAAAAAAAAAmlkAAAAAAAEAAAAAQAAA+oAAAfQAAAACERvbmF0aW9u",
            "AAAAAAAAAAAAAAAOY2xvc2VfY2FtcGFpZ24AAAAAAAIAAAAAAAAAAmlkAAAAAAAEAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAA",
            "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAACAAAAAAAAAAJpZAAAAAAABAAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAQAAAAs="]), options);
        this.options = options;
    }
    fromJSON = {
        initialize: (this.txFromJSON),
        create_campaign: (this.txFromJSON),
        get_total_donations: (this.txFromJSON),
        get_campaigns: (this.txFromJSON),
        get_campaign: (this.txFromJSON),
        donate: (this.txFromJSON),
        get_donations: (this.txFromJSON),
        close_campaign: (this.txFromJSON),
        withdraw: (this.txFromJSON)
    };
}
