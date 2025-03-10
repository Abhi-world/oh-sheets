import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Only import lovable-tagger in development mode
const componentTagger = process.env.NODE_ENV === 'production' ? null : () => import('lovable-tagger').then(m => m.componentTagger());

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
