import { ReactElement } from 'react';
import { HISTORY_KEYS } from '../utils/local-storage';
interface Props {
    title: string;
    localStorageKey: HISTORY_KEYS;
}
export declare function History({ title, localStorageKey }: Props): ReactElement | null;
export {};
