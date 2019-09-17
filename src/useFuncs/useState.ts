import { useAccessor, AccessorBuilder } from './useAccessors';
import { StateDefiner } from '../modules/state';

export const useState = <S extends {}>(state: StateDefiner<S>) => ({
  state,
  useAccessor: useAccessor as AccessorBuilder<S>
});

const { state, useAccessor: uA } = useState({
  name: 'World'
});
const { mutations, getters, useActions } = uA(
  {
    mutateA(state, name: string) {
      state.name = name;
    },
    reset(state) {
      state.name = 'World';
    }
  },
  {
    sayHello(state) {
      return `Hello, ${state.name}!`;
    }
  }
);
const { actions, useOrchestrator } = useActions({
  async fetchA(context, name: string) {
    context.commit('mutateA', name);
  },
  reset(context) {
    context.commit('reset');
  }
});
const { orchestrators } = useOrchestrator({
  resetNFetch(context, payload: string) {
    context.dispatch('reset').then(() => {
      context.dispatch('fetchA', payload);
    });
  }
});
