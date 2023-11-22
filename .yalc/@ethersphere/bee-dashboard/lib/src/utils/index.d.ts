import { BatchId, BeeDebug, PostageBatch } from '@ethersphere/bee-js';
import { BigNumber } from 'bignumber.js';
import { Token } from '../models/Token';
/**
 * Test if value is an integer
 *
 * @param value Value to be tested if it is an integer
 *
 * @returns True if the passed in value is integer
 */
export declare function isInteger(value: unknown): value is BigNumber | bigint;
/**
 *Convert value into a BigNumber if not already
 *
 * @param value Value to be converted
 *
 * @throws {TypeError} if the value is not convertible to a BigNumber
 *
 * @returns BigNumber - but it may still be NaN or Infinite
 */
export declare function makeBigNumber(value: BigNumber | bigint | number | string): BigNumber | never;
export declare type PromiseSettlements<T> = {
    fulfilled: PromiseFulfilledResult<T>[];
    rejected: PromiseRejectedResult[];
};
export declare type UnwrappedPromiseSettlements<T> = {
    fulfilled: T[];
    rejected: string[];
};
export declare function sleepMs(ms: number): Promise<void>;
/**
 * Maps the returned results of `Promise.allSettled` to an object
 * with `fulfilled` and `rejected` arrays for easy access.
 *
 * The results still need to be unwrapped to get the fulfilled values or rejection reasons.
 */
export declare function mapPromiseSettlements<T>(promises: PromiseSettledResult<T>[]): PromiseSettlements<T>;
/**
 * Maps the returned values of `Promise.allSettled` to an object
 * with `fulfilled` and `rejected` arrays for easy access.
 *
 * For rejected promises, the value is the stringified `reason`,
 * or `'Unknown error'` string when it is unavailable.
 */
export declare function unwrapPromiseSettlements<T>(promiseSettledResults: PromiseSettledResult<T>[]): UnwrappedPromiseSettlements<T>;
/**
 * Wraps a `Promise<T>` or async function inside a new `Promise<T>`,
 * which retries the original function up to `maxRetries` times,
 * waiting `delayMs` milliseconds between failed attempts.
 *
 * If all attempts fail, then this `Promise<T>` also rejects.
 */
export declare function makeRetriablePromise<T>(fn: () => Promise<T>, maxRetries?: number, delayMs?: number): Promise<T>;
export declare function extractSwarmHash(string: string): string | undefined;
export declare function extractSwarmCid(s: string): string | undefined;
export declare const regexpEns: RegExp;
export declare function extractEns(value: string): string | undefined;
export declare function recognizeEnsOrSwarmHash(value: string): string;
export declare function uuidV4(): string;
export declare function formatEnum(string: string): string;
export declare function secondsToTimeString(seconds: number): string;
export declare function convertDepthToBytes(depth: number): number;
export declare function convertAmountToSeconds(amount: number, pricePerBlock: number): number;
export declare function calculateStampPrice(depth: number, amount: bigint): Token;
export declare function shortenText(text: string, length?: number, separator?: string): string;
interface Options {
    pollingFrequency?: number;
    timeout?: number;
}
export declare function waitUntilStampUsable(batchId: BatchId, beeDebug: BeeDebug, options?: Options): Promise<PostageBatch>;
export declare function waitUntilStampExists(batchId: BatchId, beeDebug: BeeDebug, options?: Options): Promise<PostageBatch>;
export {};
