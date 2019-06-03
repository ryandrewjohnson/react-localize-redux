// @flow
import { useContext } from 'react';
import { LocalizeContext, LocalizeContextProps } from './LocalizeContext';

export const useTranslate = () => useContext(LocalizeContext);
