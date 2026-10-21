// 从本包导入，不要走 '@alilc/lowcode-types'。
// DataHandler 就定义在同包的 ./data-source-runtime 里；原来的写法绕道 engine-types，
// 而 engine-types 第 1 行又是 `export * from '@alilc/lowcode-datasource-types'`，
// 于是形成 datasource-types → engine-types → datasource-types 的类型级循环，
// 且 engine-types 并没有在本包 package.json 里声明（幽灵依赖，旧 build-scripts 靠 hoist 侥幸解析）。
import type { DataHandler } from './data-source-runtime';

export type ExtraConfig = {
  defaultDataHandler?: DataHandler;
};
