import { ReactElement } from 'react';
interface Props {
    children?: ReactElement;
    errorReporting?: (err: Error) => void;
}
declare const Dashboard: (props: Props) => ReactElement;
export default Dashboard;
