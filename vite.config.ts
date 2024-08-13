import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import envCompatible  from "vite-plugin-env-compatible";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"; //不支持tsx的按需导入
import visualizer from 'rollup-plugin-visualizer'

import { resolve } from "path";

const CWD = process.cwd();

export default defineConfig(({ mode }) => {
  const { VITE_OUTPUTDIR, VITE_PUBLIC_PATH, VITE_SYSTEM_CODE } = loadEnv(mode, CWD)
  const config = {
    base: `/${VITE_SYSTEM_CODE}/`,
    plugins: [
      vue(),
      vueJsx(),
      envCompatible({ prefix: "VITE" }),
      Components({ resolvers: [AntDesignVueResolver({ resolveIcons: true })], dts: true }),
      // visualizer({ open: true }) // 开启打包资源分析
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
      extensions: [".js", ".jsx", ".less", ".ts", ".tsx"],
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'primary-color': '#007DEE',
            'link- color': '#007DEE'
          },
          javascriptEnabled: true,
        },
      }
    },
    build: {
      sourcemap: false,
      assetsDir: `./assets${VITE_PUBLIC_PATH}`,
      outDir: VITE_OUTPUTDIR,
      cssCodeSplit: false,
    },
  }
  if (mode === "development") {
    return {
      ...config,
      server: {
        port: 1145,
        hmr: true,
        proxy: {
          "/cims-api": {
            target: loadEnv(mode, CWD).VITE_PROXY_URL,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/cims-api/, ""),
          },
          "/digital-api": {
            target: loadEnv(mode, CWD).VITE_PLATFORM_URL,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/digital-api/, ""),
          },
        },
      },
    };
  } else {
    return {
      ...config,
    };
  }
})
