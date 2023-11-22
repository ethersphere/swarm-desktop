import { BigNumber } from 'bignumber.js';
import { Token } from './Token';
export declare const BZZ_DECIMAL_PLACES = 16;
export declare class BzzToken extends Token {
    constructor(value: BigNumber | string | bigint);
    static fromDecimal(value: BigNumber | string | bigint): BzzToken;
}
