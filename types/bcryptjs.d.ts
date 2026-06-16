declare module 'bcryptjs' {
  function hash(data: string, saltOrRounds: string | number): Promise<string>
  function compare(data: string, encrypted: string): Promise<boolean>

  const bcryptjs: {
    hash: typeof hash
    compare: typeof compare
  }

  export { hash, compare }
  export default bcryptjs
}
