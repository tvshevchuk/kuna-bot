import React from 'react';

const Info = (props) => (<div>
    <h3>{props.titleName}</h3>
    <button onClick={props.onButtonClick}>{props.buttonName}</button>
    <pre>{props.viewData}</pre>
</div>);

export default Info;