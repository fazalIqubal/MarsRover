import React, {Component} from "react";
import "./index.css";
import Mars from "./mars";

class Container extends Component {

    state = {
        commands: '',
        executingCommands: '',
        execute: false,
        initialPoint: '00N'
    };

    addCommand = (e) => {
        this.setState({
            commands: this.state.commands + e.target.value
        })
    };

    runSample = (e) => {
        this.setState({
            commands: e.target.value
        });
    };

    execute = () => {
        let initialPoint = this.startInput.value;
        if (/^[0-4][0-4][NEWS]$/.test(initialPoint)) {
            this.setState({
                execute: true,
                executingCommands: this.state.commands,
                initialPoint
            });
        } else {
            alert('Invalid start position.');
        }

    };

    clearInput = () => {
        this.setState({
            commands: '',
            execute: false,
            executingCommands: ''
        });
    };

    validateInitialPoint = (e) => {
        e.target.checkValidity();
    };

    stopExecute = () => {
        this.setState({
            execute: false
        });
    };

    render() {
        let position = this.state.initialPoint || '00N';
        position = position.split('').join(' ');
        return (
            <div className={'app'}>
                <Mars
                    size={5}
                    position={position}
                    commands={this.state.executingCommands}
                    execute={this.state.execute}
                    onDone={this.stopExecute}
                />
                <div className={`control-panel`}>
                    <div className={'initial-point'}>
                        <label
                            htmlFor="initialPoint"
                        >
                            Initial Point:
                        </label>
                        <input type="text"
                               id="initialPoint"
                               maxLength={3}
                               required
                               pattern={'^[0-4][0-4][NEWS]$'}
                               defaultValue={'00N'}
                               onBlur={this.validateInitialPoint}
                               ref={(elm) => {
                                   this.startInput = elm
                               }}
                        />
                    </div>
                    <div className='commands'>
                        <button value='L' onClick={this.addCommand}>Left</button>
                        <button value='R' onClick={this.addCommand}>Right</button>                        
                        <button value='M' onClick={this.addCommand}>Move</button>
                    </div>
                    <div className='execution'>
                        <input type="text" readOnly value={this.state.commands}/>
                        <button className={'cta'} onClick={this.execute}>Execute</button>
                        <button onClick={this.clearInput} className='clear-input'>Clear</button>
                    </div>
                    <div className='samples'>
                        <label>Sample: </label>
                        <ul>
                            <li>
                                <button value={'MMRMMLMMRM'} onClick={this.runSample}>MMRMMLMMRM</button>
                            </li>
                            <li>
                                <button value={'RMMMLMRMLM'} onClick={this.runSample}>RMMMLMRMLM</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Container;
