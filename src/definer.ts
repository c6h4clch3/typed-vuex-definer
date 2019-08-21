import { MutationDefiner } from './modules/mutations';
import { GetterDefiner } from './modules/getters';
import { ActionDefiner } from './modules/actions';
import { OrchestratorDefiner } from './modules/orchestrator';
import { ModuleDefiner, ModuleTree } from './modules/module';
import { Store } from 'vuex';

type ModuleDefinition<
  S,
  M extends MutationDefiner<S>,
  G extends GetterDefiner<S>,
  A extends ActionDefiner<S, M, G>,
  O extends OrchestratorDefiner<S, A>
> = Required<ModuleDefiner<S, M, G, A, O>>;

class StoreBuilder<
  S,
  M extends MutationDefiner<S>,
  G extends GetterDefiner<S>,
  A extends ActionDefiner<S, M, G>,
  O extends OrchestratorDefiner<S, A>
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

  public defineOrchestrators<Orchestrators extends OrchestratorDefiner<S, A>>(
    orchestrators: Orchestrators
  ) {
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
  a: 'Hello, World!'
})
  .defineMutations({
    mutateA(state, payload: string) {
      state.a = payload;
    },
    reset(state) {
      state.a = 'Hello, World!';
    }
  })
  .defineGetters({
    lastLetter(state) {
      return state.a.substr(-1);
    }
  })
  .defineActions({
    triggerA(context, payload: string) {
      console.log(context.getters.lastLetter);
      context.commit({ path: 'mutateA', payload });
    },
    triggerReset({ commit }) {
      commit({ path: 'reset' });
    }
  })
  .defineOrchestrators({
    cleans(state, dispatch) {
      dispatch({ path: 'triggerReset' });
      dispatch({ path: 'triggerA', payload: '' });
    }
  });
