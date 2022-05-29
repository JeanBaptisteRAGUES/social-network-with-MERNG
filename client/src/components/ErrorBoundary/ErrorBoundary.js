import { Component, Fragment } from 'react';

import './error-boundary.css';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: '' };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error: error.toString() };
    }

    render() {
        if(this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className='errorContainer' >
                    <h1>Une erreur s'est produite :-(</h1>
                    <p>
                        {this.state.error}
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;