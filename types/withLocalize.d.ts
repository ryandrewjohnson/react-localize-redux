import React from 'react';
import { LocalizeContextType } from './LocalizeContext';
export declare function withLocalize<P extends object>(WrappedComponent: React.ComponentType<P>): React.ComponentType<P & LocalizeContextType>;
