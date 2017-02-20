# Universal-Router for Frontend routing on React

## Intro

This is a quick tutorial on how to use the [`Universal-Router`](https://github.com/kriasoft/universal-router) on a React single page app.
In this example we use TypeScript and WebPack to take advantage of the es-6 syntax and
get type help thanks to the typedefinitons files available for React and Universal-Router.

You should be able top write pretty much the same code using bebel.

## Prerequisites

I like to use [`Yarn`](https://yarnpkg.com/en/) to manage our dependencies. Let's install it globally:

```
  npm insyall yarn -g
  yarn init -y
```

We are using [`TypeScript`](http://www.typescriptlang.org/) for this mini application and [`WebPack`](https://webpack.github.io/) 
plus [`awesome-typescript-loader`](https://github.com/s-panferov/awesome-typescript-loader) to generate a bundle with a single Javascript file with all the dependencies in it.

```
  yarn add typescript webpack awesome-typescript-loader --dev
```

Our example is a zero-backend mini application so we will just serve a simple HTML page delegating the full rendering of the page to our compiled javascript code.

```
  yarn add typescript webpack --dev
```

Our `index.html` is like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title></title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body >
    <h1>Universl-Router on the front-end</h1>
    <div id="page"></div>
    <script type="application/javascript" src="/dist/main.js"></script>
  </body>
</html> 
```
> Note we are including just one single Javascript file. All the dependencies are bundle in the `dist/main.js` by webpack.

So let's get the actual modules we will need in our code:

```
  yarn add es6-promise react react-dom universal-router
```

And let's get their TypeScript type definitions:

```
  yarn add @types/es6-promise @types/react @types/react-dom @types/universal-router --dev
```

## TypeScript

To compile our source files into Javascript we will use the tsc compiler. We can set all the option in the tsconfig.json

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "noImplicitAny": false,
        "sourceMap": true,
        "sourceRoot": "./src",
        "outDir": "./dist",
        "jsx": "react"
    },
    "exclude": [
      "node_modules", "dist"
    ]
}
```

> Note that we write our source TypeScript files in the `./src` directory and output the 
result Javascript in the `./dist` directory.

## Webpack

Our configuration for webpack is simple and uses the new syntax for webpack 2:

```javascript
const path = require('path');

module.exports = {
  entry: "./src/main.tsx",
  output: {
    filename: "main.js",
    path: path.join(__dirname, "dist")
  },
  devtool: "source-map",
  resolve: {
    extensions: [ ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [ "awesome-typescript-loader" ]
      }
    ]    
  }
};
```

We save this as `webpack.config.js`. With this in place we can just add our build and start entries in our `package.json` file:

```json
{
  ...
    "scripts": {
    "build": "webpack",
    "start": "http-server -p 9000"
  },
  ...
}
```

## Universal-router: resolving routes

We can now write our application code in `./src/main.tsx`. 
Let's import React and ReactDOM amd the main functio we need from `universal-router`: the `resolve()` function. 

We import it directly using the ES6 syntax:

```typescript
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { resolve } from 'universal-router';
```

This is the function that, given a path, will inspect the routes and selects the action to be executed.
The path resolution is asynchronous and it is returned as a promise:

```typescript
resolve( routes, { path: pathtoresolve } )
.then( ( actionResult ) => {

})
.catch( (err) => {

});
```

The `resolve()` function needs a routes object, that is, a simple array or paths and actions couples like this:

```typescript
  const routes = [
    { path: '/', action: () => 'root' },
  ];
```

The `action` is a function returning some data (of our choice) related to the path property.

So let's make the data returned by the action to be a React element, and let's add multiple potential routes:

```jsx
  const routes = [
    { path: '/',                 action: () => <h2>root</h2> },
    { path: '/welcome',          action: () => <h2>Welcome to Universal-Router</h2> },
    { path: '/welcome/:message', action: ( ctx ) => <h2>Welcome at { ctx.params['message']} to universal routing</h2> },
  ];
```

The resolve() function can parse elements of the path and pass the actual value to our action functions using a Context parameter.
In our case we use `ctx` as the context object, and we access the portion of the path called message with `ctx.params['message']` .

Finally, since the action returns a React element we can use ReactDOM to render it.

```jsx
function renderOnPath( path: string ) {
  resolve( routes, { path: path } )
  .then( ( actionResult ) => {
    ReactDOM.render( <div>
      <ul>
        <li><a href="#">Root</a></li>
        <li><a href="#welcome">Generic Welcome</a></li>
        <li><a href="#welcome/home">Cusotm Welcome</a></li>
      </ul>
      <div>
        {actionResult}
      </div>
    </div>, page);
  })
  .catch( (err) => {
    ReactDOM.render( <h3>{err.statusCode}: {err.message}</h3>, page );
  } );
}
```

This function receives a path and resolves it by rendering a React JSX with the resolved component as actionResult in it.

> Keep in mind it is up to you to decide what is the result of the resolve function. You could return a set of properties to 
> pass to a root component or a encode string or a complex react tree or any other approach that makes sense to you.

## Retrierving the path

We now need to get the path to pass to the `render()` function. 

Remember we are working on the client side. So we can intercept the `hashchange` event on the window object.
Our links in our little menu are all pushing hash values on the URL (so that the page won't reload) so we need the hash component
of the `window.location` object. 

```typescript
const onHashChanged = () => {
  const path = `/${window.location.hash.substr(1)}`; 
  renderOnPath(path);
}

window.addEventListener( 'hashchange', onHashChanged );
```

In the event function we remove the initial `#` and replace it with the `/` to produce paths matchin our routes.

When we click on the menu items we will see the address change to 'http://localhost:9000/#welcome` or `http://localhost:9000/#welcome/home`.
However the path passed to the resolve function will be `/welcome` or `/welcome/home`.

This works well and we even have the browser correctly managing our click history. 

# Conclusion

Using the `Universal-router` on the front-end with React seems to work pretty well. 
I like the deneral approach of the library focused on matching a path with an available route and leaving to the
client the decision on the data to return by the action function.

This approach works well for single page applications that render their pages completely in the frontend.
With Universal-router you can manage complex routes and structure your react application the way it makes sense to you.


