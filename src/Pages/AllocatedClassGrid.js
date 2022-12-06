import { Table } from "reactstrap";
const AllocatedClassGrid = (props) =>{
    return(
        <div>
            <Table bordered>
                <thead>
                    <tr>Class Room</tr>
                </thead>
                <tbody>
                    {/* {classRooms.map(cls =>
                        <tr >
                            <td>{cls.classRoomName}</td>
                            <td>
                                <Button outline color="danger" id={cls.classRoomId} 
                                    onClick = {() =>{props.DeleteMethod(cls.classRoomId)}}> 
                                    DeAllocate
                                </Button>
                            </td>
                            
                        </tr>
                        )} */}
                </tbody>
            </Table>
        </div>
    )
}   
export default AllocatedClassGrid;