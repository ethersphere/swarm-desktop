import { ReactChild, ReactElement } from 'react';
export declare enum Platforms {
    macOS = 0,
    Linux = 1,
    Windows = 2,
    iOS = 3,
    Android = 4
}
export declare enum SupportedPlatforms {
    macOS = 0,
    Linux = 1
}
interface ContextInterface {
    platform: SupportedPlatforms;
    setPlatform: (platform: SupportedPlatforms) => void;
}
export declare const Context: import("react").Context<ContextInterface>;
export declare const Consumer: import("react").Consumer<ContextInterface>;
interface Props {
    children: ReactChild;
}
export declare function Provider({ children }: Props): ReactElement;
export {};
