import React, {Component} from "react";

class Rover extends Component {
    render() {
        const { facing, flag } = this.props;
        return <span className={`rover ${facing} ${flag ? 'flag' : ''} `}>↑</span>
    }
};

export default Rover;