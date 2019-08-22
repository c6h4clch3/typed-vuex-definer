import { MutationPayload, MutationDefiner } from './mutations';
import { GetterDefiner } from './getters';
import { Promisable } from '../utils/promisable';
import { Mutation } from 'vuex';

type CommitPayload<M extends MutationDefiner<any>, K extends keyof M> = {
  path: K;
} & (NonNullable<MutationPayload<M[K]>> extends never
  ? {}
  : { payload: MutationPayload<M[K]> });

type Commit<M extends MutationDefiner<any> = {}> = <K extends keyof M>(
  commitObj: CommitPayload<M, K>
) => void;

type Getter<G extends GetterDefiner<any>> = {
  [K in keyof G]: ReturnType<G[K]>
};

export type ActionContext<
  M extends MutationDefiner<any>,
  G extends GetterDefiner<any>
> = {
  state: M extends MutationDefiner<infer S> ? S : never;
  commit: Commit<M>;
  getters: Getter<G>;
};
export type ActionMethod<
  M extends MutationDefiner<any>,
  G extends GetterDefiner<any>
> = (context: ActionContext<M, G>, payload?: any) => Promisable<void>;
export type ActionPayload<AM extends ActionMethod<any, any>> = Parameters<
  AM
>[1];

export type ActionDefiner<
  M extends MutationDefiner<any>,
  G extends GetterDefiner<any>
> = { [key: string]: ActionMethod<M, G> };
