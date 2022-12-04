import { useState } from 'react';
import { Button, Table } from 'reactstrap';
export function ClassGrid(props){
    const[classRooms, setClasRooms] = useState(props.classData)
    return(
        <div>
            <Table borderless>
                <thead>
                    <tr>Class Room</tr>
                </thead>
                <tbody>
                    {classRooms.map(cls =>
                        <tr >
                            <td>{cls.classRoomName}</td>
                            <td><Button outline color="info" id={cls.classRoomId} onClick = {() =>{props.method(cls.classRoomId)}} >Edit</Button></td>
                            
                        </tr>
                        )}
                </tbody>
            </Table>
        </div>
    )
}