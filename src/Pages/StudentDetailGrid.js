import { Table } from "reactstrap";

const StudentDetailGrid = (props) => {
    return (
        <Table bordered>
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Teacher</th>
                </tr>
            </thead>
            <tbody>

                {props.studentData.map(item =>
                    <tr>
                        <td>{item.stSubjectName}</td>
                        <td>{item.stTeacherName}</td>
                    </tr>

                )}
            </tbody>
        </Table>
    )
}

export default StudentDetailGrid;