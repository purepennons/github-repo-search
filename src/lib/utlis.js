import invariant from 'invariant';
import isPromise from 'is-promise';
import { isFunction } from 'lodash';

export const callAsync = async (fn, ...args) => {
  invariant(isFunction(fn), 'first argument is not a function');
  const result = fn(...args);
  if (!isPromise(result)) return result;
  return await result;
};
