import { Component, ErrorInfo, ReactElement } from 'react';
interface Props {
    children: ReactElement;
    errorReporting?: (err: Error) => void;
}
interface State {
    error: Error | null;
}
export default class ErrorBoundary extends Component<Props, State> {
    private errorReporting?;
    constructor(props: Props);
    static getDerivedStateFromError(error: Error): {
        error: Error;
    };
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    render(): ReactElement;
}
export {};
