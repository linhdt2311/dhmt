export default {
    build: {
      rollupOptions: {
        input: {
          main: './index.html',
          model: './model.html', // Update this line
        },
      },
    },
  };