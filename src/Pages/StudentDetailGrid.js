import { Table } from "reactstrap";

const StudentDetailGrid = (props) => {
    return (
        <Table bordered>
            <thead>
                <tr>
                    <th>Teacher</th>
                    <th>Subject</th>
                </tr>
            </thead>
            <tbody>

                {props.studentData.map(item =>
                    <tr>
                        <td>{item.stTeacherName}</td>
                        <td>{item.stSubjectName}</td>
                    </tr>

                )}
            </tbody>
        </Table>
    )
}

export default StudentDetailGrid;