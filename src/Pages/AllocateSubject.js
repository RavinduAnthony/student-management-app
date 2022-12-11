import axios from "axios";
import { useEffect, useState } from "react"
import { Row, Col, Label, Button } from "reactstrap";
import AllocateSubjectGrid from "./AllocateSubjectGrid";
import AlertBox from "./AlertBox";
import usePageLoader from "./usePageLoader";
import PageLoader from "./PageLoader";
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
    const API_KEY = process.env.REACT_APP_API_KEY;

    const [loader, ShowLoader, HideLoader] = usePageLoader()

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
        ShowLoader()
        axios.get(`${API_KEY}Teacher/GetAllTeachers`)
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

        axios.get(`${API_KEY}Subject/GetAllSubjects`)
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
        HideLoader()
    }

    useEffect(() => {
        GetInitialData();
    }, [])

    useEffect(() => {
        setTeachersKey(teachersKey + 1);
    }, [teachers])

    const AlocateSubject = () => {
        var teacher = parseInt(teacherId)
        var subject = parseInt(subjectId)
        const isAllocated = allocSubjects.some(item => {
            if (item.subjectID === subject && item.teacherId === teacher) {
                return true;
            } else {
                return false;
            }
        })
        if (isAllocated) {
            setAlertBoxObj({
                status: true,
                message: "Subject already allocated to Teacher!",
                color: "dangerAlert",
                toggleAlert: toggleAlert
            })
        } else if (subjectId === 0) {
            setAlertBoxObj({
                status: true,
                message: "Please select a Subject!",
                color: "warningAlert",
                toggleAlert: toggleAlert
            })
        } else if (teacherId === 0) {
            setAlertBoxObj({
                status: true,
                message: "Please select a Teacher!",
                color: "warningAlert",
                toggleAlert: toggleAlert
            })
        } else {
            axios.post(`${API_KEY}SubjectAllocation/AllocateSubject`, {
                teacherId: parseInt(teacherId),
                subjectID: parseInt(subjectId)
            }).then(response => {
                setAlertBoxObj({
                    status: true,
                    message: response.data,
                    color: "successAlert",
                    toggleAlert: toggleAlert
                })
                GetAllocatedSubjectList(teacher)
            })
        }

    }

    const DeAllocateSubject = (allocatedId, teacherId) => {
        axios.post(`${API_KEY}SubjectAllocation/DeAllocateSubject?allocatedSubjectId=${allocatedId}`)
            .then(response => {
                ShowLoader()
                setAlertBoxObj({
                    status: true,
                    message: response.data,
                    color: "successAlert",
                    toggleAlert: toggleAlert
                })
                GetAllocatedSubjectList(teacherId)
                HideLoader()
            })
    }

    const HandleTeacherChange = (e) => {
        setInitialTeacher(initialTeacher + 1)
        setTeacherID(e.target.value)
        GetAllocatedSubjectList(e.target.value)
        setAlertBoxObj({
            alertBoxObj: {
                status: false,
                message: "",
                color: "success",
                toggleAlert: () => { }
            }
        })
    }

    const HandleSubjectChange = (e) => {
        setInitialSubject(initialSubject + 1)
        setSubjectId(e.target.value)
        setAlertBoxObj({
            alertBoxObj: {
                status: false,
                message: "",
                color: "success",
                toggleAlert: () => { }
            }
        })
    }

    const GetAllocatedSubjectList = (teacherId) => {
        axios.get(`${API_KEY}SubjectAllocation/GetAllocatedSubjectsById?TeacherId=${teacherId}`)
            .then(response => {
                ShowLoader()
                setAllocSubjects(
                    response.data.map(item => {
                        return {
                            allocatedId: item.allocatedId,
                            subjectName: item.subjectName,
                            teacherName: item.teacherName,
                            teacherId: item.teacherId,
                            subjectID: item.subjectID
                        }
                    })
                )
                HideLoader()
                setGridKey(gridKey + 1)
            })
    }

    const PageRefresh = () => {
        ShowLoader()
        window.location.reload()
        HideLoader()
    }
    return (
        <div>
            <hr />
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

                        <Col md="2" xs="12">
                            <Button outline color="success"
                                onClick={() => { AlocateSubject() }}
                            >
                                Allocate
                            </Button>
                        </Col>
                        <Col md="2" xs="12">
                            <Button outline color="secondary"
                                onClick={() => { PageRefresh() }}
                            >
                                Refresh
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
            {loader}
        </div>
    )
}

export default AllocateSubject;