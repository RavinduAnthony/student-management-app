import { useState } from 'react';
import { Alert } from 'reactstrap';
export function AlertBox(props) {
  const[isVisible, setIsVisible] = useState(props.status);
  
  return (
    <div>
      <Alert color={props.color} isOpen={isVisible} toggle={() =>{setIsVisible(false)}}>
        {props.message}
      </Alert>
    </div>
  )
}