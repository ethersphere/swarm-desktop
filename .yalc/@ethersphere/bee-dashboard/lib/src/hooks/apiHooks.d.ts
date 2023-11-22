import { BeeConfig } from '../utils/desktop';
export interface LatestBeeReleaseHook {
    latestBeeRelease: LatestBeeRelease | null;
    isLoadingLatestBeeRelease: boolean;
    error: Error | null;
}
export interface BeeDesktopHook {
    reachable: boolean;
    error: Error | null;
    isLoading: boolean;
    beeDesktopVersion: string;
    desktopAutoUpdateEnabled: boolean;
}
export interface NewDesktopVersionHook {
    newBeeDesktopVersion: string;
}
export declare const useBeeDesktop: (isBeeDesktop: boolean | undefined, desktopUrl: string) => BeeDesktopHook;
export declare function useNewBeeDesktopVersion(isBeeDesktop: boolean, desktopUrl: string, desktopAutoUpdateEnabled: boolean): NewDesktopVersionHook;
export interface GetBeeConfig {
    config: BeeConfig | null;
    isLoading: boolean;
    error: Error | null;
}
export declare const useGetBeeConfig: (desktopUrl: string) => GetBeeConfig;
export declare const useLatestBeeRelease: () => LatestBeeReleaseHook;
