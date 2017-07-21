import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './bootstrap-3.3.7-dist/css/bootstrap.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();