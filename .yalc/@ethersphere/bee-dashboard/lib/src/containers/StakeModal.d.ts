import { ReactElement } from 'react';
interface Props {
    onStarted: () => void;
    onFinished: () => void;
}
export default function StakeModal({ onStarted, onFinished }: Props): ReactElement;
export {};
