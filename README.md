# Meteor & Webpack

This starter is a simplified version of how we utilize [Meteor](https://github.com/meteor/meteor) and [webpack](https://github.com/webpack/webpack) together at [Ledgy](https://ledgy.com).
Using webpack for the client bundle gives us access to some features not yet available in native Meteor, such as:

* Source maps in production
* Hot module replacement
* Code splitting & dynamic import even with a strict Content Security Policy (ie. no `unsafe-eval`)
* Tree shaking
* Service worker generation

Our approach launches both, Meteor and the `webpack-dev-server`. The dev server handles client rebuilds and HMR, whereas Meteor serves just the “backend”.

The approach might seem very rough as of now, but so far works pretty well in production. The advantage is, that no modification to Meteor is required. The client bundle is simply hidden from Meteor and handled by webpack.

## Approach

We launch the Meteor and webpack in `dev.sh`. The script creates a minimal client environment by in `.dev-server/` by combining the `.dev-server-skeleton/` folder and some Meteor files.
`webpack-dev-server` is launched on the usual port `3000` whereas the Meteor instance is moved to `4000`.

Our webpack bundle simply exports a function as `window.run` that launches the client app. The Meteor client bundle is then reduced to single line calling `window.run()`.

During development, we need some more magic from `devLoader.js` to re-export the Meteor runtime config in our webpack environment.

This starter uses the forked [@ledgy/react-meteor-data](https://github.com/Ledgy/react-meteor-data) package from NPM. Since the Meteor package is not published on NPM, using it results in a duplicate React module: one from Meteor and one from webpack.


### Meteor packages

Package bundles are loaded in `.dev-server-skeleton/main.html`. Since the list is static, it sometimes needs an update if new Meteor packages are added. Some packages also assign a global variable. This can require syncing from `.meteor/local/build/programs/web.browser/app/global-imports.js` into `.dev-server-skeleton/global-imports-custom.js`


## Production deployment

A production bundle is created in two steps:
1. Building the webpack bundle: `webpack -p`\
This builds the client bundle, places all files in the `public/` folder, and adds a reference to `main.html`
2. Building the Meteor app: `meteor build ../ --directory --server-only`\
Since all files are available in the `public/` folder, the Meteor build results in a fully functional bundle using the output from webpack
