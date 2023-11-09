type RecursivePartial<T> = {
    [P in keyof T]?:
      T[P] extends (infer V)[] ? 
        RecursivePartial<V>[] :
        RecursivePartial<T[P]>;
  };
