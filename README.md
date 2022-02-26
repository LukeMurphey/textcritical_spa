# TextCritical.net Single Page App (React)

A React-based SPA (single page application that serves as the frontend for TextCritical.net)

# How do I run this?

Run `yarn install` to get the frontend ready to be executed.

You can run the front-end code using `yarn start`. However, this will not run the backend endpoints necessary for the app to run. To get a running version of the app, you will need to do one of the following:

## Run TextCritical's Server locally

By default, `webpack.dev.js` is configured to assume that TextCritical is running locally. It can be [run locally with Docker](https://lukemurphey.net/projects/ancient-text-reader/wiki/Running_with_Docker) or run locally [by running the Django app directly](https://lukemurphey.net/projects/ancient-text-reader/wiki/Setup_And_Install).

## Use the Public Instance of TextCritical

Alternatively, the public instance of TextCritical can be used by modifying `webpack.dev.js` to use textcritical.net:

    proxy: {
      '/api': {
        target: 'https://textcritical.net:443',
        secure: true,
        changeOrigin: true,
      },
      '/work_image': {
        target: 'https://textcritical.net:443',
        secure: true,
        changeOrigin: true,
      },
      'download/work': {
        target: 'https://textcritical.net:443',
        secure: true,
        changeOrigin: true,
      },
    },
