import { ReactElement, ReactNode } from 'react';
interface Props {
    label?: ReactNode;
    value?: ReactNode;
    tooltip?: string;
}
export default function ExpandableListItem({ label, value, tooltip }: Props): ReactElement | null;
export {};
