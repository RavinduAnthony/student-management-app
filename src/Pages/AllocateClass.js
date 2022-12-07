import axios from "axios";
import { useEffect, useState } from "react";
import { Row, Col, Label, Button } from "reactstrap";
import AllocatedClassGrid from "./AllocatedClassGrid";
import AlertBox from "./AlertBox";
const AllocateClass = () => {

    const [teachers, setTeachers] = useState([])
    const [teachersKey, setTeachersKey] = useState(0)
    const [classRooms, setClassRooms] = useState([])
    const [teacherId, setTeacherID] = useState(0)
    const [classId, setClassId] = useState(0);
    const [gridKey, setGridKey] = useState(1);
    const [allocClasses, setAlocClasses] = useState([])
    const [initialTeacher, setInitialTeacher] = useState(0)
    const [initialClass, setInitialClass] = useState(0)
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
    const getInitialData = () => {
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
        axios.get(`https://localhost:44319/ClassRoom/GetAllClassRooms`)
            .then(response => {
                setClassRooms(
                    response.data.map(item => {
                        return {
                            classRoomId: item.classRoomId,
                            classRoomName: item.classRoomName
                        }
                    })
                )
            })
    }

    useEffect(() => {
        getInitialData();
    }, [])

    useEffect(() => {
        setTeachersKey(teachersKey + 1);
    }, [teachers])

    const AllocateClass = () => {
        var teacher = parseInt(teacherId)
        axios.post(`https://localhost:44319/ClassAllocation/AllocateClass`, {
            teacherId: parseInt(teacherId),
            classId: parseInt(classId)
        }).then(response => {
            setAlertBoxObj({
                status: true,
                message: response.data,
                color: "successAlert",
                toggleAlert: toggleAlert
            })
            GetallocatedClassList(teacher)
        })
    }
    const HandleTeacherChange = (e) => {
        setInitialTeacher(initialTeacher + 1)
        setTeacherID(e.target.value)
        GetallocatedClassList(e.target.value)
        setAlertBoxObj({
            alertBoxObj: {
                status: false,
                message: "",
                color: "success",
                toggleAlert: () => { }
            }
        })
    }

    const HandleClassChange = (e) => {
        setInitialClass(initialClass + 1)
        setClassId(e.target.value)
        setAlertBoxObj({
            alertBoxObj: {
                status: false,
                message: "",
                color: "success",
                toggleAlert: () => { }
            }
        })
    }

    const GetallocatedClassList = (teacherId) => {
        axios.get(`https://localhost:44319/ClassAllocation/GetAllocatedClassById?TeacherId=` + teacherId)
            .then(response => {
                setAlocClasses(
                    response.data.map(item => {
                        return {
                            allocatedClassId: item.allocatedClassId,
                            classRoom: item.classRoom,
                            teacherName: item.teacherName,
                            teacherId: item.teacherId
                        }
                    })
                )
                setGridKey(gridKey + 1)
            })
    }

    const DeAllocateClass = (allocationId, teacherId) => {
        axios.post(`https://localhost:44319/ClassAllocation/DeAllocateClass?allocatedClassId=` + allocationId)
            .then(response => {
                setAlertBoxObj({
                    status: true,
                    message: response.data,
                    color: "successAlert",
                    toggleAlert: toggleAlert
                })
                GetallocatedClassList(teacherId)
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
                            <Label>Class Room</Label>

                        </Col>

                        <Col md="8" xs="12">
                            <select className="customSelect" value={classRooms.classRoomId} onChange={HandleClassChange} >
                                <option key={initialClass} >-- Select Class --</option>
                                {classRooms.map(item =>
                                    <option key={item.classRoomId} value={item.classRoomId} >{item.classRoomName}</option>
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
                                onClick={() => { AllocateClass() }}
                            >
                                Allocate
                            </Button>
                        </Col>
                        <Col md="2" xs="12">
                            <Button outline color="secondary"
                                onClick={() => { window.location.reload() }}
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
            <AllocatedClassGrid
                key={gridKey}
                allocClassData={allocClasses}
                deAllocateClass={DeAllocateClass}
            />
        </div>
    )
}

export default AllocateClass;