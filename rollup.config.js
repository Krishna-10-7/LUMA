import terser from '@rollup/plugin-terser';

const banner = `/*!
 * LumaJS v${process.env.npm_package_version || '0.1.0'}
 * (c) ${new Date().getFullYear()} LumaJS Team
 * @license MIT
 */`;

const createConfig = (input, format, file, name, minify = false) => ({
  input,
  output: {
    file,
    format,
    name: name || (format === 'umd' ? 'Luma' : undefined),
    banner,
    exports: 'named',
    sourcemap: true
  },
  plugins: minify ? [terser()] : []
});

export default [
  // LumaJS Core - ESM build (for modern bundlers and <script type="module">)
  createConfig('src/index.js', 'es', 'dist/luma.esm.js'),
  createConfig('src/index.js', 'es', 'dist/luma.esm.min.js', null, true),
  
  // LumaJS Core - CommonJS build (for Node.js)
  createConfig('src/index.js', 'cjs', 'dist/luma.cjs.js'),
  createConfig('src/index.js', 'cjs', 'dist/luma.cjs.min.js', null, true),
  
  // LumaJS Core - UMD build (for browsers via <script> tag)
  createConfig('src/index.js', 'umd', 'dist/luma.umd.js'),
  createConfig('src/index.js', 'umd', 'dist/luma.umd.min.js', null, true),
  
  // LumaAnimate - Standalone Animation Engine
  createConfig('src/animate.js', 'umd', 'dist/luma-animate.js', 'LumaAnimate'),
  createConfig('src/animate.js', 'umd', 'dist/luma-animate.min.js', 'LumaAnimate', true),
  
  // Luma3D - Standalone 3D Engine
  createConfig('src/3d.js', 'umd', 'dist/luma-3d.js', 'Luma3D'),
  createConfig('src/3d.js', 'umd', 'dist/luma-3d.min.js', 'Luma3D', true)
];
