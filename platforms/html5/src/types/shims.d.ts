declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module 'virtual:*' {
  const anyVirtual: any;
  export default anyVirtual;
}
