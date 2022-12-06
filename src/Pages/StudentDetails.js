import axios from "axios";
import { useEffect, useState } from "react";
import { Row, Col, Input, Label, Button } from "reactstrap";
import StudentDetailGrid from "./StudentDetailGrid";
const StudentDetails = () => {
    const [studentList, setStudentList] = useState([])
    const [gridDetails, setGridDetails] = useState([])
    const [initialKey, setInitialKey] = useState(0)
    const [contactPerson, setContactPerson] = useState("")
    const [contactNo, setContctNo] = useState("")
    const [classRoom, setClassRoom] = useState("")
    const [email, setEmail] = useState("")
    const [dob, setdob] = useState("")

    useEffect(() => {
        GetInitialData()
    }, [])
    const GetInitialData = () => {
        axios.get(`https://localhost:44319/Student/GetAllStudents`)
            .then(response => {
                setStudentList(
                    response.data.map(item => {
                        return {
                            studentId: item.studentId,
                            firstName: item.firstName,
                            lastName: item.lastName
                        }
                    })
                )
            })
    }

    const HandleChange = (e) => {
        GetStudentDetails(e.target.value)
        GetGridDetails(e.target.value)
        setInitialKey(initialKey + 1)
    }

    const GetStudentDetails = (studentId) => {
        axios.get(`https://localhost:44319/Student/GetStudentDetails1?StudentId=` + studentId)
            .then(response => {
                response.data.map(item => {
                    setContactPerson(item.stContactPerson)
                    setClassRoom(item.stClassName)
                    setContctNo(item.stContactNo)
                    setEmail(item.stEmail)
                    setdob(item.stDob)
                })
            })
    }

    const GetGridDetails = (studentId) => {
        axios.get(`https://localhost:44319/Student/GetStudentDetails2?StudentId=` + studentId)
            .then(response => {
                setGridDetails(
                    response.data.map(item => {
                        return {
                            stSubjectName: item.stSubjectName,
                            stTeacherName: item.stTeacherName
                        }
                    })
                )
            })
    }
    const RefreshPage = () => {
        window.location.reload()
    }
    return (
        <div>
            <br />
            <Col md="4" xs="12">
                <Label>Student Details</Label>

            </Col>
            <hr />
            <br />
            <Row>
                <Col md="5" xs="12">
                    <Row>
                        <Col md="4" xs="12">
                            <Label>Student</Label>

                        </Col>

                        <Col md="4" xs="12">
                            <select className="customSelect-details" value={studentList.studentId} onChange={HandleChange} >
                                <option key={initialKey} >-- Select Student --</option>
                                {studentList.map(item =>
                                    <option key={item.studentId} value={item.studentId}>
                                        {item.firstName} {item.lastName}
                                    </option>
                                )}
                            </select>
                        </Col>
                        <Col md="4" xs="12" >
                            <Button outline color="secondary"
                                onClick={() => { RefreshPage() }}
                            >
                                Refresh
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col md="5" xs="12">
                    <Row>
                        <Col md="4" xs="12">
                            <Label>Class Room</Label>

                        </Col>

                        <Col md="8" xs="12">
                            <Input disabled value={classRoom}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <br />
            <Row>
                <Col md="5" xs="12">
                    <Row>
                        <Col md="4" xs="12">
                            <Label>Contact Person</Label>

                        </Col>

                        <Col md="8" xs="12">
                            <Input disabled value={contactPerson}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col md="5" xs="12">
                    <Row>
                        <Col md="4" xs="12">
                            <Label>Email Address</Label>

                        </Col>

                        <Col md="8" xs="12">
                            <Input disabled value={email}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <br />
            <Row>
                <Col md="5" xs="12">
                    <Row>
                        <Col md="4" xs="12">
                            <Label>Contact Number</Label>

                        </Col>

                        <Col md="8" xs="12">
                            <Input disabled value={contactNo}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col md="5" xs="12">
                    <Row>
                        <Col md="4" xs="12">
                            <Label>Date of Birth</Label>

                        </Col>

                        <Col md="8" xs="12">
                            <Input disabled value={dob}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <br />
            <hr />
            <StudentDetailGrid
                key={initialKey}
                studentData={gridDetails} />
        </div>
    )
}

export default StudentDetails;