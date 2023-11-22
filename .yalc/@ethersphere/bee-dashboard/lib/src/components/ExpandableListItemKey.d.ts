import { ReactElement } from 'react';
interface Props {
    label: string;
    value: string;
    expanded?: boolean;
}
export default function ExpandableListItemKey({ label, value, expanded }: Props): ReactElement | null;
export {};
