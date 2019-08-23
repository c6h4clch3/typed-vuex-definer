import { GetterDefiner } from '../modules/getters';
import { ActionDefiner, ActionContext } from '../modules/actions';
import {
  OrchestratorDefiner,
  OrchestratorPayload,
  OrchestratorMethod
} from '../modules/orchestrator';
import * as Vuex from 'vuex';

type _OrchestratorKeyWithPayload<
  O extends OrchestratorDefiner<any, any, any>,
  K extends keyof O
> = NonNullable<OrchestratorPayload<O[K]>> extends never ? never : K;
type OrchestratorKeyWithPayload<
  O extends OrchestratorDefiner<any, any, any>,
  K extends keyof O = keyof O
> = _OrchestratorKeyWithPayload<O, K>;

type DefinedOrchestrator<S, O extends OrchestratorDefiner<any, any, any>> = {
  [K in keyof O]: K extends OrchestratorKeyWithPayload<O>
    ? (
        context: Vuex.ActionContext<S, {}>,
        payload: OrchestratorPayload<O[K]>
      ) => Promise<void>
    : (context: Vuex.ActionContext<S, {}>) => Promise<void>
};
export interface OrchestratorBuilder<
  S,
  G extends GetterDefiner<S>,
  A extends ActionDefiner<S, any, any>
> {
  <O extends OrchestratorDefiner<S, G, A>>(orchestrators: O): {
    orchestrators: {
      actions: DefinedOrchestrator<S, O>;
    };
  };
}
export const useOrchestrator = (
  orchestrators: Record<string, OrchestratorMethod<any, any, any>>
) => {
  return {
    orchestrators: {
      actions: Object.entries(orchestrators).reduce(
        (memo, [key, orch]) => {
          const actionMethod = async (
            { state, getters, dispatch }: Vuex.ActionContext<any, {}>,
            payload: any
          ) => {
            const context = {
              state,
              getters,
              dispatch
            };
            return orch(context, payload);
          };

          return {
            ...memo,
            [key]: actionMethod
          };
        },
        {} as DefinedOrchestrator<any, any>
      )
    }
  };
};
