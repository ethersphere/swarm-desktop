import { Bee } from '@ethersphere/bee-js';
export declare class ManifestJs {
    private bee;
    constructor(bee: Bee);
    /**
     * Tests whether a given Swarm hash is a valid mantaray manifest
     */
    isManifest(hash: string): Promise<boolean>;
    /**
     * Retrieves `website-index-document` from a Swarm hash, or `null` if it is not present
     */
    getIndexDocumentPath(hash: string): Promise<string | null>;
    /**
     * Retrieves all paths with the associated hashes from a Swarm manifest
     */
    getHashes(hash: string): Promise<Record<string, string>>;
    /**
     * Resolves an arbitrary Swarm feed manifest to its latest update reference.
     * @returns `/bzz` root manifest hash, or `Promise<null>` if hash is not a feed manifest
     * @throws in case of network errors or bad input
     */
    resolveFeedManifest(hash: string): Promise<string | null>;
    private getRootSlashMetadata;
    private extractHashes;
    private load;
    private bytesToUtf8;
    private isValueNode;
    private isRootSlash;
}
