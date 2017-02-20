import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { resolve, Route, Context, ActionContext } from 'universal-router';

const page = document.getElementById('page');

const routes = [
  { path: '/', action: () => <h2>root</h2> },
  { path: '/welcome', action: () => <h2>Welcome to Universal-Router</h2> },
  { path: '/welcome/:message', action: ( ctx ) => <h2>Welcome at { ctx.params['message']} to universal routing</h2> },
];


// Here we resolve a specific route and render the resulted dom element
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

const onHashChanged = () => {
  const path = `/${window.location.hash.substr(1)}`; 
  renderOnPath(path);
}

window.addEventListener( 'hashchange', onHashChanged );

onHashChanged();