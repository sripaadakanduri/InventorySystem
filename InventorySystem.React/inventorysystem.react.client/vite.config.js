import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5176,
        strictPort: true,
        https: false,        
        proxy: {
            "/api": {
                target: "https://localhost:7236", 
                changeOrigin: true,
                secure: false
            }
        }
    }
});