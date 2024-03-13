import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import Index from './modules/antdtransfer/Index';
import registerServiceWorker from './registerServiceWorker';
import "./common/js/Prototype"
import './common/style/common.less';
//import 'lib-flexible';

//let store = configureStore;//createStore(reducer)
ReactDOM.render(
  <Index/>,
  document.getElementById('reactwindow')
);
registerServiceWorker();
