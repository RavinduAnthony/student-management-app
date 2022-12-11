import { Button, Table } from 'reactstrap';
const TeacherGrid = (props) => {
    return(
        <div>
            <Table bordered>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Contact No</th>
                        <th>Email</th>
                    </tr>
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

export default TeacherGrid;