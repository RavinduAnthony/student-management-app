import { Table } from "reactstrap";

const StudentDetailGrid = (props) => {
    return (
        <Table bordered>
            <thead>
                <tr>Students</tr>
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