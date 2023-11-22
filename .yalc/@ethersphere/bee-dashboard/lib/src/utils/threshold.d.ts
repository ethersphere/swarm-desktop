interface Threshold {
    minimumValue: number;
    explanation: string;
    score: number;
}
declare type Thresholds = {
    connectedPeers: Threshold[];
    population: Threshold[];
    depth: Threshold[];
};
declare type ThresholdValue = {
    score: number;
    maximumScore: number;
    explanation: string;
};
export declare type ThresholdValues = {
    connectedPeers: ThresholdValue;
    population: ThresholdValue;
    depth: ThresholdValue;
};
export declare function pickThreshold(key: keyof Thresholds, value: number): ThresholdValue;
export {};
