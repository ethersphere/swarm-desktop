import type { ReactElement } from 'react';
interface Props {
    code: string;
    language: string;
    showLineNumbers?: boolean;
}
declare const CodeBlock: (props: Props) => ReactElement;
export default CodeBlock;
