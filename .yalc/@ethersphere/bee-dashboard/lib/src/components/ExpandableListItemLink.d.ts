import { ReactElement } from 'react';
interface Props {
    label: string;
    value: string;
    link?: string;
    navigationType?: 'NEW_WINDOW' | 'HISTORY_PUSH';
    allowClipboard?: boolean;
}
export default function ExpandableListItemLink({ label, value, link, navigationType, allowClipboard, }: Props): ReactElement | null;
export {};
