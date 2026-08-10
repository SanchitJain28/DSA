import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const csvApiPlugin = () => {
  return {
    name: 'csv-api',
    configureServer(server: any) {
      server.middlewares.use('/api/csv', (req: any, res: any, next: any) => {
        const csvPath = path.resolve(__dirname, '../dsa-revision.csv');
        if (req.method === 'GET') {
          if (fs.existsSync(csvPath)) {
            res.setHeader('Content-Type', 'text/csv');
            res.end(fs.readFileSync(csvPath, 'utf-8'));
          } else {
            res.statusCode = 404;
            res.end('File not found');
          }
        } else if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            fs.writeFileSync(csvPath, body, 'utf-8');
            res.statusCode = 200;
            res.end('Saved');
          });
        } else {
          next();
        }
      });
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), csvApiPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
