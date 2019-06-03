// @flow
import { useContext } from 'react';
import { LocalizeContext } from './LocalizeContext';

export const useTranslate = () => useContext(LocalizeContext);
