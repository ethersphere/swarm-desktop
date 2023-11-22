import { ReactElement } from 'react';
import type { RemixiconReactIconProps } from 'remixicon-react';
interface Props {
    label: string;
    value?: string;
    placeholder?: string;
    helperText?: string;
    expandedOnly?: boolean;
    confirmLabel?: string;
    confirmLabelDisabled?: boolean;
    confirmIcon?: React.ComponentType<RemixiconReactIconProps>;
    loading?: boolean;
    onChange?: (value: string) => void;
    onConfirm?: (value: string) => void;
    mapperFn?: (value: string) => string;
    locked?: boolean;
}
export default function ExpandableListItemKey({ label, value, onConfirm, onChange, confirmLabel, confirmLabelDisabled, confirmIcon, expandedOnly, helperText, placeholder, loading, mapperFn, locked, }: Props): ReactElement | null;
export {};
