import { Button, Table } from 'reactstrap';
export function TeacherGrid(props){
    return(
        <div>
            <Table bordered>
                <thead>
                    <tr>Teachers</tr>
                </thead>
                <tbody>
                    {props.teacherData.map(tch =>
                        <tr >
                            <td>{tch.teacherFirstName}</td>
                            <td>{tch.teacherLastName}</td>
                            <td>{tch.contactNo}</td>
                            <td>{tch.email}</td>
                            <td>
                                <Button outline color="info" id={tch.teacherId} 
                                    onClick = {() =>{props.updateMothod(tch.teacherId)}}> 
                                    Edit
                                </Button>
                            </td>
                            <td>
                                <Button outline color="danger" id={tch.teacherId} 
                                    onClick = {() =>{props.DeleteMethod(tch.teacherId)}}> 
                                    Delete
                                </Button>
                            </td>
                            
                        </tr>
                        )}
                </tbody>
            </Table>
        </div>
    )
}