import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    base: "/~doutreligne1/SAE401/frontend/dist/",
    plugins: [
        react(),
        tailwindcss(),
    ],
    preview: {
     port: 5173,
     strictPort: true,
    },
    server: {
     port: 5173,
     strictPort: true,
     host: true,
     origin: "http://localhost:8090",
     allowedHosts: ["sae-frontend"]
    },
});
