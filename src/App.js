import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import "./App.css";

const App = () => {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1>NoteTaker</h1>
                <p>Organize your Thoughts Effortlessly</p>
            </header>
            <main>
                <HomePage />
            </main>
            <footer className="app-footer">
                <p>&copy; {new Date().getFullYear()} NoteTaker. All rights reserved.</p>
            </footer>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default App;
