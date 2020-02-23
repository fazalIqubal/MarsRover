import React, {Component} from "react";
import {render} from "react-dom";
import "./index.css";
import Container from "./container";

class App extends Component {
    render() {
        return(
            <Container />
        );
    }
}

render(<App/>, document.getElementById("root"));
