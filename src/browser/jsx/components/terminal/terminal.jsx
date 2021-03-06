import $ from 'jquery';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import './lib/jqconsole.js';
import './terminal.css';
import terminalShortcuts from '../../services/terminal-shortcuts';
import commonReact from '../../services/common-react';

let message = `
IPython -- An enhanced Interactive Python.
?         -> Introduction and overview of IPython's features.
%quickref -> Quick reference.
help      -> Python's own help system.
object?   -> Details about 'object', use 'object??' for extra details.
`;

export default React.createClass({
  displayName: 'Terminal',
  propTypes: {
    focusable: React.PropTypes.bool,
    fontSize: React.PropTypes.number,
    indentWidth: React.PropTypes.number,
    message: React.PropTypes.string,
    onAutoComplete: React.PropTypes.func.isRequired,
    onClearBuffer: React.PropTypes.func.isRequired,
    onInterrupt: React.PropTypes.func.isRequired,
    onStart: React.PropTypes.func.isRequired
  },
  getDefaultProps: function () {
    return {
      focusable: true,
      fontSize: 12,
      indentWidth: 4,
      message: message
    };
  },
  componentDidMount: function () {
    const props = this.props,
      disableAutoFocus = true, // don't steal focus from other hard-working components
      el = ReactDOM.findDOMNode(this),
      jqConsole = $(el).jqconsole(props.message, '>>> ', '... ', disableAutoFocus);

    jqConsole.SetIndentWidth(this.props.indentWidth);

    terminalShortcuts.autoComplete(jqConsole, props.onAutoComplete);
    terminalShortcuts.clearBuffer(jqConsole, props.onClearBuffer);
    terminalShortcuts.clearPrompt(jqConsole);
    terminalShortcuts.interrupt(jqConsole, el, props.onInterrupt);
    terminalShortcuts.moveCursorToEnd(jqConsole);
    terminalShortcuts.moveCursorToStart(jqConsole);

    props.onStart();
  },
  shouldComponentUpdate: function (nextProps) {
    return commonReact.shouldComponentUpdate(this, nextProps);
  },
  render: function () {
    const props = this.props,
      className = commonReact.getClassNameList(this),
      style = {fontSize: props.fontSize + 'px'};

    return <div className={className.join(' ')} style={style}></div>;
  }
});
