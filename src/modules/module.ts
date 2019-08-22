import * as Vuex from 'vuex';
import { MutationDefiner } from './mutations';
import { GetterDefiner } from './getters';
import { ActionDefiner, ActionPayload } from './actions';
import { OrchestratorDefiner, OrchestratorPayload } from './orchestrator';
import { StateDefiner } from './state';

export type ModuleTree = Record<string, ModuleDefiner<any, any, any, any, any>>;
export type ModuleDefiner<
  S,
  M extends MutationDefiner<S>,
  G extends GetterDefiner<S>,
  A extends ActionDefiner<M, G>,
  O extends OrchestratorDefiner<A>
> = {
  state?: StateDefiner<S>;
  getters?: G;
  mutations?: M;
  actions?: A;
  orchestrators?: O;
  modules?: ModuleTree;
};

type ModuleOptionMutations<M extends MutationDefiner<any>> = M;
type ModuleOptionGetters<G extends GetterDefiner<any>> = G;
type ModuleOptionActions<
  S,
  A extends ActionDefiner<any, any>,
  O extends OrchestratorDefiner<A>
> = {
  [AK in keyof A]: (
    context: Vuex.ActionContext<S, unknown>,
    payload: ActionPayload<A[AK]>
  ) => Promise<void>
} &
  {
    [OK in keyof O]: (
      context: Vuex.ActionContext<S, unknown>,
      payload: OrchestratorPayload<O[OK]>
    ) => Promise<void>
  };
export type ModuleOption<
  S,
  M extends MutationDefiner<S>,
  G extends GetterDefiner<S>,
  A extends ActionDefiner<M, G>,
  O extends OrchestratorDefiner<A>
> = {
  state: StateDefiner<S>;
  getters: ModuleOptionGetters<G>;
  mutations: ModuleOptionMutations<M>;
  actions: ModuleOptionActions<S, A, O>;
};
