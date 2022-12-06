import axios from "axios";
import { useEffect, useState } from "react"
import { Row, Col, Label, Button } from "reactstrap";
import AllocateSubjectGrid from "./AllocateSubjectGrid";
import AlertBox from "./AlertBox";
const AllocateSubject = () => {

    const [teachers, setTeachers] = useState([])
    const [teachersKey, setTeachersKey] = useState(0)
    const [teacherId, setTeacherID] = useState(0)
    const [subjects, setSubjects] = useState([])
    const [subjectId, setSubjectId] = useState(0)
    const [gridKey, setGridKey] = useState(1);
    const [allocSubjects, setAllocSubjects] = useState([])
    const [initialTeacher, setInitialTeacher] = useState(0)
    const [initialSubject, setInitialSubject] = useState(0)
    const [alertBoxObj, setAlertBoxObj] = useState({
        status: false,
        message: "",
        color: "success",
        toggleAlert: () => { }
    })

    const toggleAlert = () => {
        setAlertBoxObj({
            alertBoxObj: {
                status: false,
                message: "",
                color: "success",
                toggleAlert: () => { }
            }
        })
    }

    const GetInitialData = () => {
        axios.get(`https://localhost:44319/Teacher/GetAllTeachers`)
            .then(response => {
                setTeachers(
                    response.data.map(item => {
                        return {
                            teacherId: item.teacherId,
                            teacherFirstName: item.teacherFirstName,
                            teacherLastName: item.teacherLastName,
                            contactNo: item.contactNo,
                            email: item.email
                        }
                    })
                )
            })
        axios.get(`https://localhost:44319/Subject/GetAllSubjects`)
            .then(response => {
                setSubjects(
                    response.data.map(item => {
                        return {
                            subjectId: item.subjectId,
                            subjectName: item.subjectName
                        }
                    })
                )
            })
    }

    useEffect(() => {
        GetInitialData();
    }, [])

    useEffect(() => {
        setTeachersKey(teachersKey + 1);
    }, [teachers])

    const AlocateSubject = () => {
        var teacher = parseInt(teacherId)
        axios.post(`https://localhost:44319/SubjectAllocation/AllocateSubject`, {
            teacherId: parseInt(teacherId),
            subjectID: parseInt(subjectId)
        }).then(response => {
            setAlertBoxObj({
                status: true,
                message: response.data,
                color: "success",
                toggleAlert: toggleAlert
            })
            GetAllocatedSubjectList(teacher)
        })
    }

    const DeAllocateSubject = (allocatedId, teacherId) => {
        axios.post(`https://localhost:44319/SubjectAllocation/DeAllocateSubject?allocatedSubjectId=`+allocatedId)
        .then(response => {
            setAlertBoxObj({
                status: true,
                message: response.data,
                color: "success",
                toggleAlert: toggleAlert
            })
            GetAllocatedSubjectList(teacherId)
        })
    }
    const HandleTeacherChange = (e) => {
        setInitialTeacher(initialTeacher + 1)
        setTeacherID(e.target.value)
        GetAllocatedSubjectList(e.target.value)
    }

    const HandleSubjectChange = (e) => {
        setInitialSubject(initialSubject + 1)
        setSubjectId(e.target.value)
    }

    const GetAllocatedSubjectList = (teacherId) => {
        axios.get(`https://localhost:44319/SubjectAllocation/GetAllocatedSubjectsById?TeacherId=` + teacherId)
            .then(response => {
                setAllocSubjects(
                    response.data.map(item => {
                        return {
                            allocatedId: item.allocatedId,
                            subjectName: item.subjectName,
                            teacherName: item.teacherName,
                            teacherId: item.teacherId
                        }
                    })
                )
                setGridKey(gridKey + 1)
            })
    }
    return (
        <div>
            <Row>
                <Col md="6" xs="12">
                    <Row>
                        <Col md="4" xs="12">
                            <Label>Teacher</Label>

                        </Col>

                        <Col md="8" xs="12">
                            <select className="customSelect" value={teachers.teacherId} onChange={HandleTeacherChange} >
                                <option key={initialTeacher} >-- Select Teacher --</option>
                                {teachers.map(item =>
                                    <option key={item.teacherId} value={item.teacherId} >
                                        {item.teacherFirstName + " " + item.teacherLastName}
                                    </option>
                                )}
                            </select>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <br />
            <Row>
                <Col md="6" xs="12">
                    <Row>
                        <Col md="4" xs="12">
                            <Label>Subject</Label>

                        </Col>

                        <Col md="8" xs="12">
                            <select className="customSelect" value={subjects.subjectId} onChange={HandleSubjectChange} >
                                <option key={initialSubject} >-- Select Subject --</option>
                                {subjects.map(item =>
                                    <option key={item.subjectId} value={item.subjectId}>
                                        {item.subjectName}
                                    </option>
                                )}
                            </select>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <br />
            <Row>
                <Col md="6" xs="12">
                    <Row>
                        <Col md="4" xs="12">

                        </Col>

                        <Col md="8" xs="12">
                            <Button outline color="success"
                                onClick={() => { AlocateSubject() }}
                            >
                                Allocate
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <hr />
            {alertBoxObj.status ?
                <div className="alertBox" >
                    <AlertBox alertBoxObj={alertBoxObj} />
                </div>
                : null
            }
            <AllocateSubjectGrid
                key={gridKey}
                allocSubjectData={allocSubjects}
                DeAllocateSubject={DeAllocateSubject}
            />
        </div>
    )
}

export default AllocateSubject;