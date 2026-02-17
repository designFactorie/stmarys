import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/stmarys/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        publicSchool: 'public-school.html',
        convent: 'convent.html',
        infrastructure: 'infrastructure.html',
      },
    },
  },
})
