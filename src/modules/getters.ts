export type GetterMefhod<S> = (state: S) => any;
export type GetterDefiner<S> = {
  [key: string]: GetterMefhod<S>;
};
