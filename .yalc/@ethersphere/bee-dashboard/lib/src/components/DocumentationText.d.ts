import { ReactElement } from 'react';
interface Props {
    children: (string | ReactElement)[] | (string | ReactElement);
}
export declare function DocumentationText({ children }: Props): ReactElement;
export {};
