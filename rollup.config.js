import terser from '@rollup/plugin-terser';

const banner = `/*!
 * LumaJS v${process.env.npm_package_version || '0.1.0'}
 * (c) ${new Date().getFullYear()} LumaJS Team
 * @license MIT
 */`;

const createConfig = (format, file, minify = false) => ({
  input: 'src/index.js',
  output: {
    file,
    format,
    name: format === 'umd' ? 'Luma' : undefined,
    banner,
    exports: 'named',
    sourcemap: true
  },
  plugins: minify ? [terser()] : []
});

export default [
  // ESM build (for modern bundlers and <script type="module">)
  createConfig('es', 'dist/luma.esm.js'),
  createConfig('es', 'dist/luma.esm.min.js', true),
  
  // CommonJS build (for Node.js)
  createConfig('cjs', 'dist/luma.cjs.js'),
  createConfig('cjs', 'dist/luma.cjs.min.js', true),
  
  // UMD build (for browsers via <script> tag)
  createConfig('umd', 'dist/luma.umd.js'),
  createConfig('umd', 'dist/luma.umd.min.js', true)
];
