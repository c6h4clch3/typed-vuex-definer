import { ActionPayload, ActionDefiner } from './actions';
import { Promisable } from '../utils';
import { MutationDefiner } from './mutations';

type DispatchPayload<A extends ActionDefiner<any, any>, K extends keyof A> = {
  path: K;
} & (NonNullable<ActionPayload<A[K]>> extends never
  ? {}
  : { payload: ActionPayload<A[K]> });
interface Dispatch<A extends ActionDefiner<any, any>> {
  <K extends keyof A>(payload: DispatchPayload<A, K>): Promise<void>;
}
export type OrchestratorMethod<A extends ActionDefiner<any, any>> = (
  state: A extends ActionDefiner<infer M, any>
    ? M extends MutationDefiner<infer S>
      ? S
      : never
    : never,
  dispatch: Dispatch<A>,
  payload: unknown
) => Promisable<void>;
export type OrchestratorPayload<O extends OrchestratorMethod<any>> = Parameters<
  O
>[2];

export type OrchestratorDefiner<A extends ActionDefiner<any, any>> = {
  [key: string]: OrchestratorMethod<A>;
};
