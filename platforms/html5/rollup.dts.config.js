// rollup.dts.config.mjs
import dts from 'rollup-plugin-dts';

export default {
  input: 'src/swag-api.types.ts',
  output: [ { file: 'types/swag-api.d.ts', format: 'es' } ],
  external: [ /\.svg$/i, /\.s?css$/i, /^virtual:/ ],
  plugins: [
    dts({
      tsconfig: 'tsconfig.build-types.json',
      respectExternal: false,
      compilerOptions: {
        baseUrl: '.',
        paths: { '@/*': [ 'src/*' ] }
      }
    })
  ]
};
