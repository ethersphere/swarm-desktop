import { ReactElement } from 'react';
interface Props {
    children: string;
    onClose: () => void;
}
export declare function TitleWithClose({ children, onClose }: Props): ReactElement;
export {};
