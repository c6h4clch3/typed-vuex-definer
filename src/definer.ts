import { MutationDefiner } from './modules/mutations';
import { GetterDefiner } from './modules/getters';
import { ActionDefiner, ActionMethod, ActionContext } from './modules/actions';
import { OrchestratorDefiner } from './modules/orchestrator';
import { ModuleDefiner, ModuleTree } from './modules/module';
import { Store, ActionContext as VuexActionContext } from 'vuex';

type ModuleDefinition<
  S,
  M extends MutationDefiner<S>,
  G extends GetterDefiner<S>,
  A extends ActionDefiner<S, M, G>,
  O extends OrchestratorDefiner<S, G, A>
> = Required<ModuleDefiner<S, M, G, A, O>>;

class StoreBuilder<
  S,
  M extends MutationDefiner<S>,
  G extends GetterDefiner<S>,
  A extends ActionDefiner<S, M, G>,
  O extends OrchestratorDefiner<S, G, A>
> {
  private readonly definition: ModuleDefinition<S, M, G, A, O>;
  constructor(mod: ModuleDefiner<S, M, G, A, O>) {
    this.definition = {
      state: mod.state || ({} as S),
      getters: mod.getters || ({} as G),
      mutations: mod.mutations || ({} as M),
      actions: mod.actions || ({} as A),
      orchestrators: mod.orchestrators || ({} as O),
      modules: mod.modules || {}
    };
  }

  public defineGetters<Getters extends GetterDefiner<S>>(getters: Getters) {
    return new StoreBuilder<S, M, G & Getters, A, O>({
      ...this.definition,
      getters: {
        ...this.definition.getters,
        ...getters
      }
    });
  }

  public defineMutations<Mutations extends MutationDefiner<S>>(
    mutations: Mutations
  ) {
    return new StoreBuilder<S, M & Mutations, G, A, O>({
      ...this.definition,
      mutations: {
        ...this.definition.mutations,
        ...mutations
      }
    });
  }

  public defineActions<Actions extends ActionDefiner<S, M, G>>(
    actions: Actions
  ) {
    return new StoreBuilder<S, M, G, A & Actions, O>({
      ...this.definition,
      actions: {
        ...this.definition.actions,
        ...actions
      }
    });
  }

  public defineOrchestrators<
    Orchestrators extends OrchestratorDefiner<S, G, A>
  >(orchestrators: Orchestrators) {
    return new StoreBuilder<S, M, G, A, O & Orchestrators>({
      ...this.definition,
      orchestrators: {
        ...this.definition.orchestrators,
        ...orchestrators
      }
    });
  }

  public defineModules(modules: ModuleTree) {
    return new StoreBuilder({
      ...this.definition,
      modules: {
        ...this.definition.modules,
        ...modules
      }
    });
  }
}

const initState = <S extends {}>(state: S) => {
  return new StoreBuilder<S, {}, {}, {}, {}>({
    state
  });
};

const modules = initState({
  name: 'World'
})
  .defineMutations({
    mutateA(state, payload: string) {
      state.name = payload;
    },
    reset(state) {
      state.name = 'World!';
    }
  })
  .defineGetters({
    lastLetter(state) {
      return state.name.substr(-1);
    },
    sayHello(state) {
      return `Hello, ${state.name}!`;
    }
  })
  .defineActions({
    triggerA(context, payload: string) {
      context.commit('mutateA', payload);
    },
    triggerReset({ commit }) {
      commit('reset');
    }
  })
  .defineOrchestrators({
    async cleans({ dispatch }, payload: string) {
      await dispatch('triggerReset');
      await dispatch('triggerA', payload);
    }
  });
