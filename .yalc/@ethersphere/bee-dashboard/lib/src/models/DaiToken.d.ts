import { BigNumber } from 'bignumber.js';
import { Token } from './Token';
export declare class DaiToken extends Token {
    constructor(value: BigNumber | string | bigint);
    static fromDecimal(value: BigNumber | string | bigint): DaiToken;
}
