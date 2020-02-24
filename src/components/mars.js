import React from "react";
import Rover from "./rover";

const CARDINAL_DIRECTION = {  
    N: [0, 1],
    S: [0, -1],
    E: [1, 0],
    W: [-1, 0],
};

const WHEN_ROVER_MOVES_LEFT = {
    N: "W",    
    S: "E",
    E: "N",
    W: "S"
};

const WHEN_ROVER_MOVES_RIGHT = {
    N: "E",
    S: "W",
    W: "N",
    E: "S",  
};

class Mars extends React.Component {

    initialState = {
        start: null,
        position: "0,0",
        end: null,
        ops: [],        
        facing: "N",
        path: null,
        error: null,
    };

    state = Object.assign({}, this.initialState);

    componentDidMount() {
        this.reset(() => {
            this.process(this.props);
        });
    }

    componentWillReceiveProps(nextProps) {
        this.reset(() => {
            this.process(nextProps);
        });
    }

    reset = (cb) => {
        this.setState(this.initialState, cb);
    };

    process = (props) => {
        const {commands, position} = props;
        if (commands === '') {
            this.setState(this.initialState);
        } else {
            const parts = position.split(" ");
            this.setState(
                {
                    start: parts[0] + "," + parts[1],
                    position: parts[0] + "," + parts[1],
                    facing: parts[2]
                },
                () => {
                    if (props.execute) {
                        this.execute(commands);
                    }
                }
            );
        }
    };

    execute = (commands) => {
        let ops = (commands || "").split("");
        this.setState({ops}, () => {
            setTimeout(this.run.bind(this), 500);
        });
    };

    run = () => {
        let ops = this.state.ops.slice();
        let {position, path, facing} = this.state;
        path = path || {};
        path[position] = facing;
        let op = ops.shift();
        let newPosition = {};
        if (op === "L") {
            newPosition = this.turnLeft();
        } else if (op === "R") {
            newPosition = this.turnRight();
        } else if (op === "M") {
            newPosition = this.moveForward();
        } else {
            console.log("Invalid command");
        }
        if (newPosition.error) {
            alert('Can not move beyond the grid');
        }
        this.setState(Object.assign(this.state, {
            ops,
            path,
            ...newPosition
        }), () => {
            if (this.state.ops.length > 0 && !this.state.error) {
                setTimeout(this.run.bind(this), 300);
            } else {
                this.setState({
                    end: this.state.position
                })
            }
        })

    };

    moveForward = () => {
        const {size} = this.props;
        const {position, facing} = this.state;
        const moveVector = CARDINAL_DIRECTION[facing];
        const pos = position.split(',').map(Number);
        const x = pos[0] + moveVector[0];
        const y = pos[1] + moveVector[1];
        if (x < 0 || x >= size || y < 0 || y >= size) {
            return {error: true};
        }
        return {
            position: x + ',' + y
        };
    };

    turnLeft = () => {
        const {facing} = this.state;
        return ({
            facing: WHEN_ROVER_MOVES_LEFT[facing]
        });
    };

    turnRight = () => {
        const {facing} = this.state;
        return ({
            facing: WHEN_ROVER_MOVES_RIGHT[facing]
        });
    };

    render() {

        const {size} = this.props;
        let {position, facing, path} = this.state;
        path = path || {};
        let cells = [];
        for (let i = size - 1; i >= 0; i--) {
            for (let j = 0; j < size; j++) {
                cells.push(j + "," + i);
            }
        }
        return (
            <ul className="mars">
                {cells.map(cell => {

                    let roverElm = null;
                    let roverPath = null;
                    let cellStatus = '';

                    if (this.state.error && this.state.end === cell) {
                        cellStatus = 'error';
                    }
                    if (this.state.start === cell) {
                        cellStatus += ' start';
                    }
                    if (this.state.end === cell) {
                        cellStatus += ' end';
                    }

                    if (position === cell) {
                        roverElm = <Rover facing={facing}/>;
                    } else {
                        roverPath = (path[cell] ? <Rover facing={path[cell]} flag={true}/> : null);
                    }

                    return (
                        <li className={`cell ${!!path[cell] ? 'path' : ''} ${cellStatus}`} key={cell}>
                            <label>{cell}</label>
                            {roverElm || roverPath}
                        </li>
                    );
                })}
            </ul>
        );
    }
}

export default Mars;