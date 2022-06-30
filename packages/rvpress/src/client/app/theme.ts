import { ComponentType } from 'react';

export interface Theme {
    Layout: ComponentType;
    NotFound?: ComponentType;
}
