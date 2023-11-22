import { ReactElement, ReactNode } from 'react';
interface Props {
    children: ReactNode;
    expandable: ReactNode;
    defaultOpen?: boolean;
}
export default function ExpandableElement({ children, expandable, defaultOpen }: Props): ReactElement | null;
export {};
