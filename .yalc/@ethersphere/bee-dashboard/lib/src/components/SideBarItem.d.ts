import type { ReactElement, ReactNode } from 'react';
interface Props {
    iconStart?: ReactNode;
    iconEnd?: ReactNode;
    path?: string;
    label: ReactNode;
    pathMatcherSubstring?: string;
}
export default function SideBarItem({ iconStart, iconEnd, path, label, pathMatcherSubstring }: Props): ReactElement;
export {};
