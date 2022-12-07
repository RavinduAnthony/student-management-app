import { useState, useEffect } from 'react';
import { Alert } from 'reactstrap';

const AlertBox = (props) => {

  return (
    <div>
      <Alert className={props.alertBoxObj.color} color={props.alertBoxObj.color} isOpen={props.alertBoxObj.status} toggle={() => { props.alertBoxObj.toggleAlert(); }}>
        {props.alertBoxObj.message}
      </Alert>
    </div>
  )
}

export default AlertBox;