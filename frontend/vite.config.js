import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,        // 👈 ajoute cette ligne
    setupFiles: ['./setupTests.js'],
  }
});