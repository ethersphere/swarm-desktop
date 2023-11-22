import { ReactElement } from 'react';
import './App.css';
interface Props {
    beeApiUrl?: string;
    beeDebugApiUrl?: string;
    defaultRpcUrl?: string;
    lockedApiSettings?: boolean;
    isDesktop?: boolean;
    desktopUrl?: string;
    errorReporting?: (err: Error) => void;
}
declare const App: ({ beeApiUrl, beeDebugApiUrl, defaultRpcUrl, lockedApiSettings, isDesktop, desktopUrl, errorReporting, }: Props) => ReactElement;
export default App;
