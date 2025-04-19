import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
    port: parseInt(process.env.PORT, 10) || 3000, // Use the PORT environment variable or default to 3000
    host: "0.0.0.0", // Bind to all network interfaces
    port: process.env.PORT || 3000, // Use the PORT environment variable or default to 3000
  },
});
