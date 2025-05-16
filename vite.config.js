import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})


// import { defineConfig } from 'vite';

// export default defineConfig({
//   resolve: {
//     alias: {
//       'react-chartjs-2': 'react-chartjs-2/dist/index.js',
//     },
//   },
// });
