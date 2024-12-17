import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/printable-statblocks/" : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      src: path.resolve(__dirname, "./src"),
    },
  },
});
