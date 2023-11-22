import type { Topology } from '@ethersphere/bee-js';
import type { ReactElement } from 'react';
interface Props {
    topology: Topology | null;
}
declare const TopologyStats: (props: Props) => ReactElement;
export default TopologyStats;
