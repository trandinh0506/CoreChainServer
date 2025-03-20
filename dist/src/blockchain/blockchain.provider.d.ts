import Web3 from 'web3';
import { ConfigService } from '@nestjs/config';
export declare const BlockchainProvider: {
    provide: string;
    useFactory: (configService: ConfigService) => Promise<{
        web3: Web3<import("web3-eth").RegisteredSubscription>;
        contract: import("web3").Contract<({
            inputs: any[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
            name?: undefined;
            outputs?: undefined;
            constant?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            stateMutability?: undefined;
            outputs?: undefined;
            constant?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: any[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
            constant?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            constant: boolean;
            anonymous?: undefined;
        })[]>;
        account: string;
    }>;
    inject: (typeof ConfigService)[];
};
