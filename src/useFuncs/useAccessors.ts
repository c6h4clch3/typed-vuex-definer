import { ActionBuilder, useActions } from './useActions';
import { MutationDefiner } from '../modules/mutations';
import { GetterDefiner } from '../modules/getters';

type DefinedMutation<S, M extends MutationDefiner<S>> = M;
type DefinedGetters<S, G extends GetterDefiner<S>> = G;

export interface AccessorBuilder<S> {
  <M extends MutationDefiner<S>, G extends GetterDefiner<S>>(
    mutations: M,
    getters: G
  ): {
    mutations: {
      mutations: DefinedMutation<S, M>;
    };
    getters: {
      getters: DefinedGetters<S, G>;
    };
    useActions: ActionBuilder<S, M, G>;
  };
}
export const useAccessor = (
  mutations: MutationDefiner<any>,
  getters: GetterDefiner<any>
) => ({
  mutations: {
    mutations: mutations as DefinedMutation<any, any>
  },
  getters: {
    getters: getters as DefinedGetters<any, any>
  },
  useActions
});
