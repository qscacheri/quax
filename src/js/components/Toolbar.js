import React, { Component } from "react";
import { connect } from "react-redux";
import { addObject } from '../actions/index.js';
import { OBJECT_TYPES } from '../constants/object-types';
import { OBJECT_CONFIGS } from '../constants/object-configs';
import '../../css/Toolbar.css';
 
function mapDispatchToProps(dispatch) {
    return {
        addObject: object => dispatch(addObject(object))
    };
}

class ConnectedToolbar extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(e) {
        var newObject = OBJECT_CONFIGS[OBJECT_TYPES.EMPTY];
        newObject.id = new Date().getTime();
        newObject.position = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        }   
        this.props.addObject(newObject);
    }

    render() {
        return (
            <div className="Toolbar">
                <button onClick={this.handleClick.bind(this)}>new object</button>
            </div>
        )
    }
}
    const Toolbar = connect(
        null,
        mapDispatchToProps
    )(ConnectedToolbar);
    export default Toolbar;