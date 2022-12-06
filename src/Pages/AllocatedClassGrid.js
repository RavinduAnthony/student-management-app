import { Table,Button } from "reactstrap";
const AllocatedClassGrid = (props) =>{
    return(
        <div>
            <Table bordered>
                <thead>
                    <tr>Class Room</tr>
                </thead>
                <tbody>
                    {props.allocClassData.map(cls =>
                        <tr >
                            <td>{cls.teacherName}</td>
                            <td>{cls.classRoom}</td>
                            <td>
                                <Button outline color="danger" id={cls.allocatedClassId} 
                                    onClick = {() =>{props.deAllocateClass(cls.allocatedClassId,cls.teacherId)}}> 
                                    DeAllocate
                                </Button>
                            </td>
                            
                        </tr>
                        )}
                </tbody>
            </Table>
        </div>
    )
}   
export default AllocatedClassGrid;