import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import laravel from 'laravel-vite-plugin';

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (!id.startsWith('figma:asset/')) {
        return null;
      }

      const filename = id.replace('figma:asset/', '');

      return path.resolve(import.meta.dirname, 'src/assets', filename);
    },
  };
}

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/app.tsx'],
      refresh: true,
    }),
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (id.includes('react-router')) {
            return 'router';
          }

          if (id.includes('react-dom') || id.includes('/react/')) {
            return 'react-vendor';
          }

          if (id.includes('motion')) {
            return 'motion';
          }

          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'ui-kit';
          }

          return 'vendor';
        },
      },
    },
  },
});
