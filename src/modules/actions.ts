import { MutationPayload, MutationDefiner } from './mutations';
import { GetterDefiner } from './getters';
import { Promisable } from '../utils/promisable';

type CommitPayload<M extends MutationDefiner<any>, K extends keyof M> = {
  path: K;
} & (NonNullable<MutationPayload<M[K]>> extends never
  ? {}
  : { payload: MutationPayload<M[K]> });

type Commit<S, M extends MutationDefiner<S> = {}> = <K extends keyof M>(
  commitObj: CommitPayload<M, K>
) => void;

type Getter<G extends GetterDefiner<any>> = {
  [K in keyof G]: ReturnType<G[K]>
};

export type ActionContext<
  S,
  M extends MutationDefiner<S>,
  G extends GetterDefiner<S>
> = {
  state: S;
  commit: Commit<S, M>;
  getters: Getter<G>;
};
export type ActionMethod<
  S,
  M extends MutationDefiner<any>,
  G extends GetterDefiner<any>
> = (context: ActionContext<S, M, G>, payload?: any) => Promisable<void>;
export type ActionPayload<AM extends ActionMethod<any, any, any>> = Parameters<
  AM
>[1];

export type ActionDefiner<
  S,
  M extends MutationDefiner<any>,
  G extends GetterDefiner<any>
> = { [key: string]: ActionMethod<S, M, G> };
