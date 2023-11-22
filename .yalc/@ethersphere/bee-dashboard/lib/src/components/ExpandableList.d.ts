import { ReactElement, ReactNode } from 'react';
interface Props {
    children?: ReactNode;
    label: ReactNode;
    info?: ReactNode;
    level?: 0 | 1 | 2;
    defaultOpen?: boolean;
}
export default function ExpandableList({ children, label, level, defaultOpen, info }: Props): ReactElement | null;
export {};
