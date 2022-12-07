import { Component } from "react";
import { StudentGrid } from "./StudentGrid";
import AlertBox from "./AlertBox";
import validator from 'validator';
import isEmail from 'validator/lib/isEmail';
import {
    Row, Col, Label, Button, Input
} from 'reactstrap';
import axios from "axios";

export class StudentForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            studentId: 0,
            firstName: '',
            lastName: '',
            contactPerson: '',
            contactNumber: '',
            email: '',
            age: '',
            dob: '',
            classId: 0,
            initialKey: 0,
            currentDate: new Date(),
            studentList: [],
            classList: [],
            gridKey: 1,
            isShowAlert: false,
            alertMessage: "",
            alertClassName: "",
            isUpdating: false,
            isCalcAge: false,
            isStudentValid: true,
            alertBoxObj: {
                status: false,
                message: "",
                color: "success",
                toggleAlert: () => { }
            }
        }
        this.HandleChange = this.HandleChange.bind(this)
        this.LoadStudentList = this.LoadStudentList.bind(this)
        this.toggleAlert = this.toggleAlert.bind(this)
        this.DeleteStudent = this.DeleteStudent.bind(this)
        this.GetStudentById = this.GetStudentById.bind(this)
        this.CalculateAge = this.CalculateAge.bind(this)
        this.SetInitialState = this.SetInitialState.bind(this)
    }

    componentDidMount() {
        this.LoadStudentList(() => {
            this.setState({
                gridKey: this.state.gridKey + 1
            })
        })
    }

    LoadStudentList(callback) {
        axios.get(`https://localhost:44319/Student/GetAllStudents`)
            .then(response => {
                this.setState({
                    studentList: response.data.map(std => {
                        return {
                            studentId: std.studentId,
                            firstName: std.firstName,
                            lastName: std.lastName,
                            contactPerson: std.contactPerson,
                            contactNo: std.contactNo,
                            email: std.email,
                            dateOfBirth: std.dateOfBirth,
                            st_classRoomId: std.classId
                        }
                    })
                })
                callback(true);
            })
        axios.get(`https://localhost:44319/ClassRoom/GetAllClassRooms`)
            .then(response => {
                this.setState({
                    classList: response.data.map(cls => {
                        return {
                            classRoomId: cls.classRoomId,
                            classRoomName: cls.classRoomName
                        }
                    })
                })
                callback(true)
            })
    }

    DeleteStudent(studentId) {
        axios.post(`https://localhost:44319/Student/DeleteStudent?StudentId=` + studentId)
            .then(response => {
                if (response.status === 200) {
                    this.setState({ alertClassName: "primary" })
                }
                else {
                    this.setState({ alertClassName: "danger" })
                }
                this.setState({
                    alertBoxObj: {
                        status: true,
                        message: response.data,
                        color: "successAlert",
                        toggleAlert: this.toggleAlert
                    }
                })
                this.LoadStudentList(() => {
                    debugger;
                    this.setState({
                        gridKey: this.state.gridKey + 1
                    })
                });
            })
    }

    GetStudentById(studentId) {
        axios.get(`https://localhost:44319/Student/GetStudentById?StudentID=` + studentId)
            .then(response => {
                if (response.status === 200) {
                    for (let i = 0; i < response.data.length; i++) {
                        this.setState({
                            studentId: response.data[i].studentId,
                            firstName: response.data[i].firstName,
                            lastName: response.data[i].lastName,
                            contactPerson: response.data[i].contactPerson,
                            contactNumber: response.data[i].contactNo,
                            email: response.data[i].email,
                            dob: response.data[i].dateOfBirth,
                            classId: parseInt(response.data[i].st_classRoomId),
                            initialKey: this.state.initialKey + 1,
                            isUpdating: true
                        })
                    }
                }
                else {
                    this.setState({ alertClassName: "danger" })
                    this.setState({ isShowAlert: true })
                    this.setState({ alertMessage: "Not Found!" })
                }
            })
    }

    SaveStudent() {
        const studentAvailability = this.state.studentList.some(std => {
            if (std.email === this.state.email || std.contactNo === this.state.contactNumber) {
                return true;
            } else {
                return false;
            }
        })

        if (this.state.firstName.length === 0 || this.state.lastName.length === 0 || this.state.contactNumber.length === 0
            || this.state.contactPerson.length === 0 || this.state.email.length === 0 || this.state.dob.length === 0
            || this.state.classId === 0) {
            this.setState({
                alertBoxObj: {
                    status: true,
                    message: "Please provide All the Fields!!",
                    color: "warningAlert",
                    toggleAlert: this.toggleAlert
                }
            })
        } else if (this.state.contactNumber.length > 10 || this.state.contactNumber.length < 10) {
            this.setState({
                alertBoxObj: {
                    status: true,
                    message: "Please provide a valid Phone Number!!",
                    color: "warningAlert",
                    toggleAlert: this.toggleAlert
                }
            })
        } else if (!validator.isEmail(this.state.email)) {
            this.setState({
                alertBoxObj: {
                    status: true,
                    message: "Please provide a valid Email!!",
                    color: "warningAlert",
                    toggleAlert: this.toggleAlert
                }
            })
        } else {
            if (this.state.studentId === 0 && studentAvailability) {
                this.setState({
                    alertBoxObj: {
                        status: true,
                        message: "Student Already Exists!",
                        color: "dangerAlert",
                        toggleAlert: this.toggleAlert
                    }
                })
            } else {
                axios.post(`https://localhost:44319/Student/SaveStudent`, {
                    studentId: parseInt(this.state.studentId),
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    contactPerson: this.state.contactPerson,
                    contactNo: this.state.contactNumber,
                    email: this.state.email,
                    dateOfBirth: this.state.dob,
                    st_classRoomId: parseInt(this.state.classId)
                }).then(response => {
                    if (response.status === 200) {
                        this.setState({ alertClassName: "primary" })
                    }
                    else {
                        this.setState({
                            alertBoxObj: {
                                status: true,
                                message: response.data,
                                color: "dangerAlert",
                                toggleAlert: this.toggleAlert
                            }
                        })
                    }
                    this.setState({
                        alertBoxObj: {
                            status: true,
                            message: response.data,
                            color: "successAlert",
                            toggleAlert: this.toggleAlert
                        }
                    })
                    this.LoadStudentList(() => {
                        debugger;
                        this.setState({
                            gridKey: this.state.gridKey + 1
                        })
                    });
                })
            }
            this.SetInitialState()
        }
    }

    SetInitialState() {
        this.setState({
            firstName: "",
            lastName: "",
            contactPerson: "",
            contactNumber: "",
            email: "",
            age: "",
            dob: "",
            classId: 0
        })
    }

    toggleAlert() {
        this.setState({
            alertBoxObj: {
                status: false,
                message: "",
                color: "success",
                toggleAlert: ""
            }
        })
    }

    HandleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            alertBoxObj: {
                status: false,
                message: "",
                color: "success",
                toggleAlert: () => { }
            }
        })
    }

    CalculateAge(event) {
        this.setState({ dob: event.target.value })
        var birthdate = new Date(event.target.value)
        var currentDate = new Date()
        var difference = Math.abs(currentDate - birthdate)
        var age = Math.floor((difference / (1000 * 60 * 60 * 24)) / 365)
        this.setState({ age: age })
    }

    render() {
        return (
            <div>
                <hr />
                <Row>
                    <Col md="5" xs="12">
                        <Row>
                            <Col md="4" xs="12">
                                <Label>First Name</Label>
                            </Col>
                            <Col md="8" xs="12">
                                <Input
                                    value={this.state.firstName}
                                    name="firstName"
                                    onChange={this.HandleChange}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col md="5" xs="12">
                        <Row>
                            <Col md="4" xs="12">
                                <Label>Last Name</Label>
                            </Col>
                            <Col md="8" xs="12">
                                <Input
                                    value={this.state.lastName}
                                    name="lastName"
                                    onChange={this.HandleChange}
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
                                <Input
                                    value={this.state.contactPerson}
                                    name="contactPerson"
                                    onChange={this.HandleChange}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col md="5" xs="12">
                        <Row>
                            <Col md="4" xs="12">
                                <Label>Contact Number</Label>
                            </Col>
                            <Col md="8" xs="12">
                                <Input
                                    value={this.state.contactNumber}
                                    name="contactNumber"
                                    onChange={this.HandleChange}
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
                                <Label>Date of Birth</Label>
                            </Col>
                            <Col md="8" xs="12">
                                <Input
                                    type="date"
                                    value={this.state.dob}
                                    name="dob"
                                    onChange={this.CalculateAge}
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
                                <Input
                                    type="email"
                                    value={this.state.email}
                                    name="email"
                                    onChange={this.CalculateAge}
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
                                <Label>Age</Label>
                            </Col>
                            <Col md="8" xs="12">
                                <Input
                                    value={this.state.age}
                                    disabled
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col md="5" xs="12">
                        <Row>
                            <Col md="4" xs="12">
                                <Label>Class</Label>
                            </Col>
                            <Col md="8" xs="12">
                                <select className="customSelect" onChange={this.HandleChange}
                                    name="classId" value={this.state.classId}>
                                    <option key={this.state.initialKey} value="none"> -- Select Class -- </option>
                                    {this.state.classList.map(item =>
                                        <option key={item.classRoomId} value={item.classRoomId}>{item.classRoomName}</option>
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
                                    onClick={() => { this.SaveStudent() }}
                                >
                                    Save
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
                <div className="alertBox" >
                    <AlertBox alertBoxObj={this.state.alertBoxObj} />
                </div>
                <hr />
                <br />
                <div>
                    <StudentGrid
                        key={this.state.gridKey}
                        studentData={this.state.studentList}
                        updateMothod={this.GetStudentById}
                        DeleteMethod={this.DeleteStudent} />
                </div>
            </div>
        )
    }
}