import { ChangeEvent, ReactElement } from 'react';
interface Props {
    name: string;
    label: string;
    password?: boolean;
    formik?: boolean;
    optional?: boolean;
    defaultValue?: string;
    placeholder?: string;
    onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}
export declare function SwarmTextInput({ name, label, password, optional, formik, onChange, defaultValue, placeholder, }: Props): ReactElement;
export {};
