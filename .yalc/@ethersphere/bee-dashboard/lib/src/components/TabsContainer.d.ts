import { ReactElement, ReactNode } from 'react';
interface TabsValues {
    component: ReactNode;
    label: ReactNode;
}
interface Props {
    values: TabsValues[];
    index?: number;
    indexChanged?: (index: number) => void;
}
export default function SimpleTabs({ values, index, indexChanged }: Props): ReactElement;
export {};
