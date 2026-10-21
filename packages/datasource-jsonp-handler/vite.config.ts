import { isAbsolute } from 'node:path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// 库模式 external 判定：只 externalize 裸导入（依赖 / peer / workspace 包），
// 相对路径和项目内绝对路径必须打进 bundle。
//
// 不要用 `!id.startsWith('.') && !id.startsWith('/')` 这种写法：Windows 上 Vite 会用
// 已解析的绝对路径（D:/.../src/x.ts）二次回调，它既不以 '.' 也不以 '/' 开头，
// 于是本地源文件被误判为 external，产物留下指向不存在的 ./x.ts 的悬空 import。
function isBare(id: string) {
  if (id.startsWith('.') || id.startsWith('virtual:') || id.startsWith('\0')) return false;
  if (id.startsWith('/')) return false;
  if (/^[a-zA-Z]:[\/]/.test(id)) return false; // Windows 盘符绝对路径
  if (id.startsWith('\\')) return false; // UNC 路径
  if (id.startsWith('@oxc-project/runtime')) return false; // Vite 8 oxc helper，需内联
  return !isAbsolute(id);
}

export default defineConfig({
  plugins: [
    dts({ entryRoot: 'src', outDir: 'dist', insertTypesEntry: true }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (f) => (f === 'es' ? 'index.mjs' : 'index.cjs'),
    },
    rollupOptions: {
      external: isBare,
    },
    sourcemap: true,
    minify: false,
    emptyOutDir: true,
  },
});
