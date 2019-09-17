import * as Vuex from 'vuex';
import { OrchestratorBuilder, useOrchestrator } from './useOrchestrators';
import { ActionDefiner, ActionPayload, ActionMethod } from '../modules/actions';
import { MutationDefiner } from '../modules/mutations';
import { GetterDefiner } from '../modules/getters';

type _ActionKeyWithPayload<
  A extends ActionDefiner<any, any, any>,
  K extends keyof A
> = NonNullable<ActionPayload<A[K]>> extends never ? never : K;
type ActionKeyWithPayload<
  A extends ActionDefiner<any, any, any>,
  K extends keyof A = keyof A
> = K extends string ? _ActionKeyWithPayload<A, K> : never;

type DefinedAction<S, A extends ActionDefiner<S, any, any>> = {
  [K in keyof A]: K extends ActionKeyWithPayload<A>
    ? (
        context: Vuex.ActionContext<S, {}>,
        payload: ActionPayload<A[K]>
      ) => Promise<void>
    : (context: Vuex.ActionContext<S, {}>) => Promise<void>
};
export interface ActionBuilder<
  S,
  M extends MutationDefiner<S>,
  G extends GetterDefiner<S>
> {
  <A extends ActionDefiner<S, M, G>>(actions: A): {
    actions: {
      actions: DefinedAction<S, A>;
    };
    useOrchestrator: OrchestratorBuilder<S, G, A>;
  };
}
export const useActions = (
  actions: Record<string, ActionMethod<any, any, any>>
) => {
  return {
    actions: {
      actions: Object.entries(actions).reduce(
        (memo, [key, act]) => {
          const actionMethod = async (
            { state, getters, commit }: Vuex.ActionContext<any, {}>,
            payload: any
          ) => {
            const context = {
              state,
              getters,
              commit
            };
            return act(context, payload);
          };

          return {
            ...memo,
            [key]: actionMethod
          };
        },
        {} as DefinedAction<any, any>
      )
    },
    useOrchestrator
  };
};
