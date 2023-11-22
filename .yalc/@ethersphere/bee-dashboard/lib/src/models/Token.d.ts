import { BigNumber } from 'bignumber.js';
declare const POSSIBLE_DECIMALS: number[];
declare type digits = typeof POSSIBLE_DECIMALS[number];
export declare class Token {
    private amount;
    private readonly decimals;
    constructor(amount: BigNumber | string | bigint, decimals?: digits);
    /**
     * Construct new Token from a digit representation
     *
     * @param amount    Amount of a token in the digits (1 token = 10^decimals)
     * @param decimals  Number of decimals for the token (must be integer)
     *
     * @throws {TypeError} If the decimals is not an integer or the amount after conversion is not an integer
     *
     * @returns new Token
     */
    static fromDecimal(amount: BigNumber | string | bigint, decimals?: digits): Token | never;
    get toBigInt(): bigint;
    get toString(): string;
    get toBigNumber(): BigNumber;
    get toDecimal(): BigNumber;
    toFixedDecimal(digits?: number): string;
    toSignificantDigits(digits?: number): string;
    minusBaseUnits(amount: string): Token;
    plusBaseUnits(amount: string): Token;
}
export {};
