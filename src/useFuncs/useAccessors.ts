import * as Vuex from 'vuex';
import { ActionBuilder, useActions } from './useActions';
import { MutationDefiner, MutationPayload } from '../modules/mutations';

type _MutationKeyWithPayload<
  M extends MutationDefiner<any>,
  K extends keyof M
> = NonNullable<MutationPayload<M[K]>> extends never ? never : K;
type MutationKeyWithPayload<
  M extends MutationDefiner<any>,
  K extends keyof M
> = K extends string ? _MutationKeyWithPayload<M, K> : never;
