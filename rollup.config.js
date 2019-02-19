import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  external: ['react', 'redux'],
  output: [
    { 
      file: pkg.main, 
      name: 'ReactLocalizeRedux',
      format: 'umd', 
      sourcemap: true 
    },
    { 
      file: pkg.module, 
      format: 'es', 
      sourcemap: true 
    },
    { 
      file: pkg.main, 
      format: 'cjs', 
      sourcemap: true 
    }
  ],
  plugins: [
    resolve(), 
    commonjs(), 
    typescript()
  ]
}

