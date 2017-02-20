import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { resolve, Route, Context, ActionContext } from 'universal-router';

type FrontRoutes = Route< ActionContext | Context  ,React.ReactElement<any> >[];

const page = document.getElementById('page');

// Here we define the possible routes
// const routes: FrontRoutes = [
//   { path: '/', action: () => <h2>root</h2> },
//   { 
//     path: '/welcome', 
//     action: undefined, // () => <h2>pippo</h2>,
//     children: [
//       {
//         path : '/',
//         action: ( ctx: ActionContext ) => <h2>Welcome to universal routing</h2>,
//       },
//       {
//         path : '/:message',
//         action( ctx: ActionContext ) { return <h2>Welcome at { ctx.params['message']} to universal routing</h2> },
//       }
//     ]
//   }
// ];

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
  // We use replace state because the pushState was done anutomatically when following the link
  // history.replaceState( { path: path }, path, path );
  renderOnPath(path);
}

// const onPopState = ( event ) => {
//   if ( event.state ) // We know how to manage going back to a state with a state. 
//     renderOnPath(event.state.path);
// }

window.addEventListener( 'hashchange', onHashChanged );
// window.addEventListener( 'popstate', onPopState );

onHashChanged();