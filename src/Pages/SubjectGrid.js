import { useState } from 'react';
import { Button, Table } from 'reactstrap';
const SubjectGrid = (props) => {
    const [subjects, setSubject] = useState(props.subjectData);
    return (
        <div>
            <Table bordered>
                <thead>
                    <tr>
                        <th>Subject</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map(sbj =>
                        <tr >
                            <td>{sbj.subjectName}</td>
                            <td>
                                <Button outline color="info" id={sbj.subjectId}
                                    onClick={() => { props.updateMothod(sbj.subjectId) }}
                                >
                                    Edit
                                </Button>
                            </td>
                            <td>
                                <Button outline color="danger" id={sbj.subjectId}
                                    onClick={() => { props.DeleteMethod(sbj.subjectId) }}
                                >
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

export default SubjectGrid;