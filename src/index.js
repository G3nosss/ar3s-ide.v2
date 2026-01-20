import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const App = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#282c34", color: "#fff" }}>
            <h1>Welcome to the Ar3s IDE Suite</h1>
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
