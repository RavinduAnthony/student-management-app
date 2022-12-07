import { Button, Table } from "reactstrap"
export function StudentGrid(props){
    return(
        <div>
            <Table bordered>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Contact Person</th>
                        <th>Contact No</th>
                        <th>Email Address</th>
                        <th>Date of Birth</th>
                    </tr>
                </thead>
                <tbody>
                    {props.studentData.map(std =>
                        <tr >
                            <td>{std.firstName}</td>
                            <td>{std.lastName}</td>
                            <td>{std.contactPerson }</td>
                            <td>{std.contactNo }</td>
                            <td>{std.email }</td>
                            <td>{std.dateOfBirth }</td>
                            <td>
                                <Button outline color="info" id={std.studentId} 
                                    onClick = {() =>{props.updateMothod(std.studentId)}}> 
                                    Edit
                                </Button>
                            </td>
                            <td>
                                <Button outline color="danger" id={std.studentId} 
                                    onClick = {() =>{props.DeleteMethod(std.studentId)}}> 
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