type Unsubscribe = () => void;

const vState = <State>(state: State) => {
  const stateKeys: ReadonlyArray<keyof State> = Object.keys(state) as any;
  const subscribers: Map<keyof State, Set<(value: any, prevValue: any, key: any) => void>> = new Map();
  const stateContainer = {
    subscribe: <Key extends keyof State>(
      fn: (value: typeof state[Key], prevValue: typeof state[Key], key: Key) => void,
      keys: { 0: Key } & ReadonlyArray<Key> = stateKeys as any
    ): Unsubscribe => {
      keys.forEach(key => subscribers.get(key)?.add(fn) ?? subscribers.set(key, new Set([fn])));
      return () => keys.forEach(key => subscribers.get(key)?.delete(fn));
    },
    dispatch: <Key extends keyof State>(...keys: ReadonlyArray<Key>) => keys.forEach(key => subscribers.get(key)?.forEach(fn => fn(state[key], state[key], key))),
  };

  stateKeys.forEach(key =>
    Object.defineProperty(stateContainer, key, {
      get: () => state[key],
      set: value => {
        const prevValue = state[key];
        prevValue !== (state[key] = value) && subscribers.get(key)?.forEach(fn => fn(state[key], prevValue, key));
      },
    })
  );

  return stateContainer as typeof stateContainer & State;
};

export default vState;
