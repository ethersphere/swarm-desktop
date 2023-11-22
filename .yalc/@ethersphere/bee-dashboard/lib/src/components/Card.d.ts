import { ReactElement } from 'react';
import { SwarmButtonProps } from './SwarmButton';
interface Props {
    icon: ReactElement;
    title: string;
    subtitle: string;
    buttonProps: SwarmButtonProps;
    status: 'ok' | 'error' | 'loading' | 'connecting';
}
export default function Card({ buttonProps, icon, title, subtitle, status }: Props): ReactElement;
export {};
