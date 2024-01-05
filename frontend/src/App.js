// frontend/src/App.js

import React from 'react';
import './App.css';
import JobForm from './components/JobForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Job Application Form</h1>
            </header>
            <JobForm />
        </div>
    );
}

export default App;
