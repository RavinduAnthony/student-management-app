import axios from "axios";
import { useEffect, useState } from "react";
import { Row, Col, Label, Button } from "reactstrap";
import AllocatedClassGrid from "./AllocatedClassGrid";
const AllocateClass = () => {

    const [teachers, setTeachers] = useState([])
    const [teachersKey, setTeachersKey] = useState(0)
    const [classRooms, setClassRooms] = useState([])
    const [teacherId, setTeacherID] = useState(0)
    const [classId, setClassId] = useState(0);
    const [gridKey, setGridKey] = useState(1);
    const [allocClasses, setAlocClasses] = useState([])

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
            if (response.status === 200) {
                alert("Allocated")
            } else {
                alert("DeAllocated")
            }
            GetallocatedClassList(teacher)
        })
    }
    const HandleTeacherChange = (e) => {
        setTeacherID(e.target.value)
        GetallocatedClassList(e.target.value)
    }

    const HandleClassChange = (e) => {
        setClassId(e.target.value)
    }

    const GetallocatedClassList = (teacherId) => {
        axios.get(`https://localhost:44319/ClassAllocation/GetAllocatedClassById?TeacherId=` + teacherId)
            .then(response => {
                setAlocClasses(
                    response.data.map(item => {
                        return {
                            allocatedClassId: item.allocatedClassId,
                            classRoom: item.classRoom,
                            teacherName: item.teacherName
                        }
                    })
                )
                setGridKey(gridKey + 1)
            })
    }

    const DeAllocateClass = (teacherId) => {
        axios.post(`https://localhost:44319/ClassAllocation/DeAllocateClass?allocatedClassId=` + teacherId)
            .then(response => {
                if (response.status === 200) {
                    alert("DeAllocated")
                } else {
                    alert("Failed!")
                }
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

                        <Col md="8" xs="12">
                            <Button outline color="success"
                                onClick={() => { AllocateClass() }}
                            >
                                Allocate
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <hr />
            <AllocatedClassGrid
                key={gridKey}
                allocClassData={allocClasses}
                deAllocateClass={DeAllocateClass}
            />
        </div>
    )
}

export default AllocateClass;