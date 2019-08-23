import { ActionPayload, ActionDefiner } from './actions';
import { Promisable } from '../utils';
import { GetterDefiner } from './getters';

type DispatchPayload<
  A extends ActionDefiner<any, any, any>,
  K extends keyof A
> = NonNullable<ActionPayload<A[K]>> extends never ? [] : [ActionPayload<A[K]>];
type ActionKeyWithPayload<
  A extends ActionDefiner<any, any, any>,
  K extends keyof A = keyof A
> = K extends string
  ? NonNullable<ActionPayload<A[K]>> extends never
    ? never
    : K
  : never;

interface Dispatch<A extends ActionDefiner<any, any, any>> {
  <K extends ActionKeyWithPayload<A>>(
    type: K,
    payload: ActionPayload<A[K]>
  ): Promise<void>;
  <K extends keyof A>(type: K, ...payload: DispatchPayload<A, K>): Promise<
    void
  >;
}
type Getter<G extends GetterDefiner<any>> = {
  [K in keyof G]: ReturnType<G[K]>
};
type OrchestratorContext<
  S,
  G extends GetterDefiner<any>,
  A extends ActionDefiner<any, any, any>
> = {
  state: S;
  getters: Getter<G>;
  dispatch: Dispatch<A>;
};
export type OrchestratorMethod<
  S,
  G extends GetterDefiner<any>,
  A extends ActionDefiner<any, any, any>
> = (context: OrchestratorContext<S, G, A>, payload?: any) => Promisable<void>;
export type OrchestratorPayload<
  O extends OrchestratorMethod<any, any, any>
> = Parameters<O>[1];

export type OrchestratorDefiner<
  S,
  G extends GetterDefiner<any>,
  A extends ActionDefiner<any, any, any>
> = {
  [key: string]: OrchestratorMethod<S, G, A>;
};
