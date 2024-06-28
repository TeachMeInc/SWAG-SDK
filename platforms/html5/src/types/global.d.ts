declare global {
  interface Window {
    SWAGTHEME: string;
    SWAGAPI: APIWrapper;
  }
}

declare module '*.handlebars' {
  const value: {
    compiler: [number, string],
    main: (container: any, depth: any, helpers: any, partials: any, data: any) => void,
    useData: boolean,
    usePartial: boolean,
  };
  export default value;
}
