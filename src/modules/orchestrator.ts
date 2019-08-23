import { ActionPayload, ActionDefiner } from './actions';
import { Promisable } from '../utils';

type DispatchPayload<
  A extends ActionDefiner<any, any, any>,
  K extends keyof A
> = {
  path: K;
} & (NonNullable<ActionPayload<A[K]>> extends never
  ? {}
  : { payload: ActionPayload<A[K]> });
interface Dispatch<A extends ActionDefiner<any, any, any>> {
  <K extends keyof A>(payload: DispatchPayload<A, K>): Promise<void>;
}
export type OrchestratorMethod<S, A extends ActionDefiner<any, any, any>> = (
  state: S,
  dispatch: Dispatch<A>,
  payload: unknown
) => Promisable<void>;
export type OrchestratorPayload<
  O extends OrchestratorMethod<any, any>
> = Parameters<O>[2];

export type OrchestratorDefiner<S, A extends ActionDefiner<any, any, any>> = {
  [key: string]: OrchestratorMethod<S, A>;
};
