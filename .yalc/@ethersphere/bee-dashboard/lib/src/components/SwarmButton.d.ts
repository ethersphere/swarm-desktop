import { ButtonProps } from '@material-ui/core';
import React, { ReactElement } from 'react';
import type { RemixiconReactIconProps } from 'remixicon-react';
export interface SwarmButtonProps extends ButtonProps {
    iconType: React.ComponentType<RemixiconReactIconProps>;
    loading?: boolean;
    cancel?: boolean;
    variant?: 'text' | 'contained' | 'outlined';
}
export declare function SwarmButton({ children, onClick, iconType, className, disabled, loading, cancel, variant, style, ...other }: SwarmButtonProps): ReactElement;
