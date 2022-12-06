import { Table,Button } from "reactstrap";
const AllocateSubjectGrid = (props) => {
    return(
        <Table bordered>
                <thead>
                    <tr>Subject</tr>
                </thead>
                <tbody>
                    {props.allocSubjectData.map(subj =>
                        <tr >
                            <td>{subj.teacherName}</td>
                            <td>{subj.subjectName}</td>
                            <td>
                                <Button outline color="danger" id={subj.allocatedId} 
                                    onClick = {() =>{props.DeAllocateSubject(subj.allocatedId,subj.teacherId)}}> 
                                    DeAllocate
                                </Button>
                            </td>
                            
                        </tr>
                        )}
                </tbody>
            </Table>
    )
}

export default AllocateSubjectGrid;