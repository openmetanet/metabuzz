declare module '*.json' {
  const value: any
  export default value
}

interface ObjTypes<T> {
  [key: string]: T;
  [key: number]: T;
}
