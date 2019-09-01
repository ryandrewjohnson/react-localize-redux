import React from 'react';
import { TranslateOptions } from './LocalizeContext';
declare type Props = {
    id?: string;
    data?: {
        [key: string]: string;
    };
    options?: TranslateOptions;
    children?: React.ReactNode;
};
export declare const Translate: React.FC<Props>;
export {};
