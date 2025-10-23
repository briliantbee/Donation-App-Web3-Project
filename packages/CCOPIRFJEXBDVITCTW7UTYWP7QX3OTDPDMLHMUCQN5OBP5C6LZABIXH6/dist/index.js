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
        contractId: "CCOPIRFJEXBDVITCTW7UTYWP7QX3OTDPDMLHMUCQN5OBP5C6LZABIXH6",
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
        super(new ContractSpec(["AAAAAgAAAAAAAAAAAAAAEENhbXBhaWduQ2F0ZWdvcnkAAAAFAAAAAAAAAAAAAAAFWmFrYXQAAAAAAAAAAAAAAAAAAApQZW5kaWRpa2FuAAAAAAAAAAAAAAAAAAlLZXNlaGF0YW4AAAAAAAAAAAAAAAAAAAtCZW5jYW5hQWxhbQAAAAAAAAAAAAAAAARVTUtN",
            "AAAAAgAAAAAAAAAAAAAADkNhbXBhaWduU3RhdHVzAAAAAAADAAAAAAAAAAAAAAAGQWN0aXZlAAAAAAAAAAAAAAAAAAlDb21wbGV0ZWQAAAAAAAAAAAAAAAAAAAZDbG9zZWQAAA==",
            "AAAAAQAAAAAAAAAAAAAACENhbXBhaWduAAAACQAAAAAAAAAIY2F0ZWdvcnkAAAfQAAAAEENhbXBhaWduQ2F0ZWdvcnkAAAAAAAAACmNyZWF0ZWRfYXQAAAAAAAYAAAAAAAAADmN1cnJlbnRfYW1vdW50AAAAAAALAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAAAJpZAAAAAAABAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAGc3RhdHVzAAAAAAfQAAAADkNhbXBhaWduU3RhdHVzAAAAAAAAAAAADXRhcmdldF9hbW91bnQAAAAAAAALAAAAAAAAAAV0aXRsZQAAAAAAABA=",
            "AAAAAQAAAAAAAAAAAAAACERvbmF0aW9uAAAABQAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAtjYW1wYWlnbl9pZAAAAAAEAAAAAAAAAAVkb25vcgAAAAAAABMAAAAAAAAADGlzX2Fub255bW91cwAAAAEAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAY=",
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==",
            "AAAAAAAAAAAAAAAPY3JlYXRlX2NhbXBhaWduAAAAAAYAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAAAhjYXRlZ29yeQAAB9AAAAAQQ2FtcGFpZ25DYXRlZ29yeQAAAAAAAAANdGFyZ2V0X2Ftb3VudAAAAAAAAAsAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAABAAAABA==",
            "AAAAAAAAAAAAAAAGZG9uYXRlAAAAAAAEAAAAAAAAAAVkb25vcgAAAAAAABMAAAAAAAAAC2NhbXBhaWduX2lkAAAAAAQAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAMaXNfYW5vbnltb3VzAAAAAQAAAAA=",
            "AAAAAAAAAAAAAAANZ2V0X2NhbXBhaWducwAAAAAAAAAAAAABAAAD6gAAB9AAAAAIQ2FtcGFpZ24=",
            "AAAAAAAAAAAAAAAMZ2V0X2NhbXBhaWduAAAAAQAAAAAAAAALY2FtcGFpZ25faWQAAAAABAAAAAEAAAfQAAAACENhbXBhaWdu",
            "AAAAAAAAAAAAAAAWZ2V0X2NhbXBhaWduX2RvbmF0aW9ucwAAAAAAAQAAAAAAAAALY2FtcGFpZ25faWQAAAAABAAAAAEAAAPqAAAH0AAAAAhEb25hdGlvbg==",
            "AAAAAAAAAAAAAAARZ2V0X2FsbF9kb25hdGlvbnMAAAAAAAAAAAAAAQAAA+oAAAfQAAAACERvbmF0aW9u",
            "AAAAAAAAAAAAAAAOY2xvc2VfY2FtcGFpZ24AAAAAAAIAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAALY2FtcGFpZ25faWQAAAAABAAAAAA=",
            "AAAAAAAAAAAAAAATZ2V0X3RvdGFsX2RvbmF0aW9ucwAAAAAAAAAAAQAAAAs=",
            "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAACAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAtjYW1wYWlnbl9pZAAAAAAEAAAAAQAAAAs=",
            "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAAT"]), options);
        this.options = options;
    }
    fromJSON = {
        initialize: (this.txFromJSON),
        create_campaign: (this.txFromJSON),
        donate: (this.txFromJSON),
        get_campaigns: (this.txFromJSON),
        get_campaign: (this.txFromJSON),
        get_campaign_donations: (this.txFromJSON),
        get_all_donations: (this.txFromJSON),
        close_campaign: (this.txFromJSON),
        get_total_donations: (this.txFromJSON),
        withdraw: (this.txFromJSON),
        get_admin: (this.txFromJSON)
    };
}
