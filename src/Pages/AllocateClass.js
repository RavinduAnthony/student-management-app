import axios from "axios";
import { useEffect, useState } from "react";
import { Row, Col, Label, Button } from "reactstrap";
import AllocatedClassGrid from "./AllocatedClassGrid";
const AllocateClass = () => {

    const [teachers, setTeachers] = useState([])
    const [classRooms, setClassRooms] = useState([])

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

    const AllocateClass = () => {
        console.log(classRooms)
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
                            <select className="customSelect">
                                {teachers.map(item =>
                                    <option key={item.teacherId} >{item.teacherFirstName + " " + item.teacherLastName}</option>
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
                            <select className="customSelect">
                                {classRooms.map(item => 
                                    <option key={item.classRoomId} >{item.classRoomName}</option>
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
            <AllocatedClassGrid />
        </div>
    )
}

export default AllocateClass;