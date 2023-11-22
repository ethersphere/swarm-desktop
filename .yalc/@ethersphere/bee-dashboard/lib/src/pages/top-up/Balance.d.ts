import { ReactElement } from 'react';
interface Props {
    header: string;
    title: string;
    p: ReactElement;
    next: string;
}
export default function Index({ header, title, p, next }: Props): ReactElement;
export {};
