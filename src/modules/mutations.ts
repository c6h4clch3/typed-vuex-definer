export type MutationMethod<S> = (state: S, payload?: any) => void;
export type MutationPayload<M> = M extends MutationMethod<any>
  ? Parameters<M>[1]
  : never;
export type MutationDefiner<S> = { [key: string]: MutationMethod<S> };
