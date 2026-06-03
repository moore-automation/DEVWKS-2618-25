import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const createNoJekyll = () => ({
  name: 'create-nojekyll',
  closeBundle() {
    const outDir = resolve(__dirname, '..', 'docs')
    writeFileSync(resolve(outDir, '.nojekyll'), '')
  },
})

function normalizeSiteBase(raw) {
  const fallback = '/DEVWKS-2618/'
  if (raw == null || raw === '') return fallback
  let b = String(raw).trim()
  if (!b.startsWith('/')) b = `/${b}`
  return b.endsWith('/') ? b : `${b}/`
}

export default defineConfig({
  plugins: [react(), tailwindcss(), createNoJekyll()],
  base: normalizeSiteBase(process.env.SITE_BASE),
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
})
