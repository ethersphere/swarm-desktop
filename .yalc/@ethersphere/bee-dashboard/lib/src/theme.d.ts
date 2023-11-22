import { Theme } from '@material-ui/core/styles';
declare module '@material-ui/core/styles/createPalette' {
    interface TypeBackground {
        appBar: string;
    }
}
export declare const theme: Theme;
