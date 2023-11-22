import { ReactElement } from 'react';
export declare type SelectEvent = React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
}>;
interface Props {
    label?: string;
    name?: string;
    options: {
        value: string;
        label: string;
    }[];
    onChange?: (event: SelectEvent) => void;
    formik?: boolean;
    defaultValue?: string;
    placeholder?: string;
    disabled?: boolean;
}
export declare function SwarmSelect({ defaultValue, formik, name, options, onChange, label, placeholder, disabled, }: Props): ReactElement;
export {};
