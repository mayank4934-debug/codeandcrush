// vite.config.js
import { fileURLToPath, URL } from "url";
import react from "file:///home/ubuntu/workspace/app/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@20.19.37_/node_modules/@vitejs/plugin-react/dist/index.js";
import { defineConfig } from "file:///home/ubuntu/workspace/app/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.37/node_modules/vite/dist/node/index.js";
import environment from "file:///home/ubuntu/workspace/app/node_modules/.pnpm/vite-plugin-environment@1.1.3_vite@5.4.21_@types+node@20.19.37_/node_modules/vite-plugin-environment/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///home/ubuntu/workspace/app/src/frontend/vite.config.js";
var ii_url = process.env.DFX_NETWORK === "local" ? `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8081/` : `https://identity.internetcomputer.org/`;
process.env.II_URL = process.env.II_URL || ii_url;
process.env.STORAGE_GATEWAY_URL = process.env.STORAGE_GATEWAY_URL || "https://blob.caffeine.ai";
var vite_config_default = defineConfig({
  logLevel: "error",
  build: {
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    chunkSizeWarningLimit: 1e3,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-motion": ["motion/react"],
          "vendor-router": ["@tanstack/react-router"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-dfinity": ["@dfinity/agent", "@dfinity/auth-client", "@dfinity/candid", "@dfinity/identity", "@dfinity/principal"],
          "vendor-ui": ["lucide-react"]
        }
      }
    }
  },
  css: {
    postcss: "./postcss.config.js"
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis"
      }
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true
      }
    }
  },
  plugins: [
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment(["II_URL"]),
    environment(["STORAGE_GATEWAY_URL"]),
    react()
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", __vite_injected_original_import_meta_url))
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    ],
    dedupe: ["@dfinity/agent"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS91YnVudHUvd29ya3NwYWNlL2FwcC9zcmMvZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3VidW50dS93b3Jrc3BhY2UvYXBwL3NyYy9mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS91YnVudHUvd29ya3NwYWNlL2FwcC9zcmMvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IGVudmlyb25tZW50IGZyb20gXCJ2aXRlLXBsdWdpbi1lbnZpcm9ubWVudFwiO1xuXG5jb25zdCBpaV91cmwgPVxuICBwcm9jZXNzLmVudi5ERlhfTkVUV09SSyA9PT0gXCJsb2NhbFwiXG4gICAgPyBgaHR0cDovL3JkbXg2LWphYWFhLWFhYWFhLWFhYWRxLWNhaS5sb2NhbGhvc3Q6ODA4MS9gXG4gICAgOiBgaHR0cHM6Ly9pZGVudGl0eS5pbnRlcm5ldGNvbXB1dGVyLm9yZy9gO1xuXG5wcm9jZXNzLmVudi5JSV9VUkwgPSBwcm9jZXNzLmVudi5JSV9VUkwgfHwgaWlfdXJsO1xucHJvY2Vzcy5lbnYuU1RPUkFHRV9HQVRFV0FZX1VSTCA9XG4gIHByb2Nlc3MuZW52LlNUT1JBR0VfR0FURVdBWV9VUkwgfHwgXCJodHRwczovL2Jsb2IuY2FmZmVpbmUuYWlcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgbG9nTGV2ZWw6IFwiZXJyb3JcIixcbiAgYnVpbGQ6IHtcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIG1pbmlmeTogdHJ1ZSxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIFwidmVuZG9yLXJlYWN0XCI6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCJdLFxuICAgICAgICAgIFwidmVuZG9yLW1vdGlvblwiOiBbXCJtb3Rpb24vcmVhY3RcIl0sXG4gICAgICAgICAgXCJ2ZW5kb3Itcm91dGVyXCI6IFtcIkB0YW5zdGFjay9yZWFjdC1yb3V0ZXJcIl0sXG4gICAgICAgICAgXCJ2ZW5kb3ItcXVlcnlcIjogW1wiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCJdLFxuICAgICAgICAgIFwidmVuZG9yLWRmaW5pdHlcIjogW1wiQGRmaW5pdHkvYWdlbnRcIiwgXCJAZGZpbml0eS9hdXRoLWNsaWVudFwiLCBcIkBkZmluaXR5L2NhbmRpZFwiLCBcIkBkZmluaXR5L2lkZW50aXR5XCIsIFwiQGRmaW5pdHkvcHJpbmNpcGFsXCJdLFxuICAgICAgICAgIFwidmVuZG9yLXVpXCI6IFtcImx1Y2lkZS1yZWFjdFwiXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgY3NzOiB7XG4gICAgcG9zdGNzczogXCIuL3Bvc3Rjc3MuY29uZmlnLmpzXCIsXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICBkZWZpbmU6IHtcbiAgICAgICAgZ2xvYmFsOiBcImdsb2JhbFRoaXNcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcHJveHk6IHtcbiAgICAgIFwiL2FwaVwiOiB7XG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vMTI3LjAuMC4xOjQ5NDNcIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgZW52aXJvbm1lbnQoXCJhbGxcIiwgeyBwcmVmaXg6IFwiQ0FOSVNURVJfXCIgfSksXG4gICAgZW52aXJvbm1lbnQoXCJhbGxcIiwgeyBwcmVmaXg6IFwiREZYX1wiIH0pLFxuICAgIGVudmlyb25tZW50KFtcIklJX1VSTFwiXSksXG4gICAgZW52aXJvbm1lbnQoW1wiU1RPUkFHRV9HQVRFV0FZX1VSTFwiXSksXG4gICAgcmVhY3QoKSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiBbXG4gICAgICB7XG4gICAgICAgIGZpbmQ6IFwiZGVjbGFyYXRpb25zXCIsXG4gICAgICAgIHJlcGxhY2VtZW50OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuLi9kZWNsYXJhdGlvbnNcIiwgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaW5kOiBcIkBcIixcbiAgICAgICAgcmVwbGFjZW1lbnQ6IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi4vc3JjXCIsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgfSxcbiAgICBdLFxuICAgIGRlZHVwZTogW1wiQGRmaW5pdHkvYWdlbnRcIl1cbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1UyxTQUFTLGVBQWUsV0FBVztBQUMxVSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxpQkFBaUI7QUFIOEosSUFBTSwyQ0FBMkM7QUFLdk8sSUFBTSxTQUNKLFFBQVEsSUFBSSxnQkFBZ0IsVUFDeEIsdURBQ0E7QUFFTixRQUFRLElBQUksU0FBUyxRQUFRLElBQUksVUFBVTtBQUMzQyxRQUFRLElBQUksc0JBQ1YsUUFBUSxJQUFJLHVCQUF1QjtBQUVyQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixVQUFVO0FBQUEsRUFDVixPQUFPO0FBQUEsSUFDTCxhQUFhO0FBQUEsSUFDYixXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUix1QkFBdUI7QUFBQSxJQUN2QixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixnQkFBZ0IsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUNyQyxpQkFBaUIsQ0FBQyxjQUFjO0FBQUEsVUFDaEMsaUJBQWlCLENBQUMsd0JBQXdCO0FBQUEsVUFDMUMsZ0JBQWdCLENBQUMsdUJBQXVCO0FBQUEsVUFDeEMsa0JBQWtCLENBQUMsa0JBQWtCLHdCQUF3QixtQkFBbUIscUJBQXFCLG9CQUFvQjtBQUFBLFVBQ3pILGFBQWEsQ0FBQyxjQUFjO0FBQUEsUUFDOUI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxFQUNYO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxNQUNkLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxZQUFZLE9BQU8sRUFBRSxRQUFRLFlBQVksQ0FBQztBQUFBLElBQzFDLFlBQVksT0FBTyxFQUFFLFFBQVEsT0FBTyxDQUFDO0FBQUEsSUFDckMsWUFBWSxDQUFDLFFBQVEsQ0FBQztBQUFBLElBQ3RCLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQztBQUFBLElBQ25DLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxjQUFjLElBQUksSUFBSSxtQkFBbUIsd0NBQWUsQ0FBQztBQUFBLE1BQ3hFO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUM5RDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVEsQ0FBQyxnQkFBZ0I7QUFBQSxFQUMzQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
