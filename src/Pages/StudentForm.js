import { Component } from "react";
import StudentGrid from "./StudentGrid";
import AlertBox from "./AlertBox";
import validator from 'validator';
import usePageLoader from "./usePageLoader";
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
            alertBoxObj: {
                status: false,
                message: "",
                color: "success",
                toggleAlert: () => { }
            }
        }
        this.HandleChange = this.HandleChange.bind(this);
        this.LoadStudentList = this.LoadStudentList.bind(this);
        this.toggleAlert = this.toggleAlert.bind(this);
        this.DeleteStudent = this.DeleteStudent.bind(this);
        this.GetStudentById = this.GetStudentById.bind(this);
        this.CalculateAge = this.CalculateAge.bind(this);
        this.DisplayAge = this.DisplayAge.bind(this);
        this.SetInitialState = this.SetInitialState.bind(this);
        this.ValidateFields = this.ValidateFields.bind(this);
        this.LoadStudentsToGrid = this.LoadStudentsToGrid.bind(this);
    }

    componentDidMount() {
        this.LoadStudentList(() => {
            this.setState({
                gridKey: this.state.gridKey + 1
            })
        })
    }

    LoadStudentList(callback) {
        axios.get(`${process.env.REACT_APP_API_KEY}Student/GetAllStudents`)
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
                            st_classRoomId: std.classId,
                            classRoomName: std.classRoomName
                        }
                    })
                })
                callback(true);
            })
        axios.get(`${process.env.REACT_APP_API_KEY}ClassRoom/GetAllClassRooms`)
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
        axios.post(`${process.env.REACT_APP_API_KEY}Student/DeleteStudent?StudentId=${studentId}`)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        alertBoxObj: {
                            status: true,
                            message: response.data,
                            color: "successAlert",
                            toggleAlert: this.toggleAlert
                        }
                    })
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
                this.LoadStudentsToGrid();
            })
    }

    GetStudentById(studentId) {
        axios.get(`${process.env.REACT_APP_API_KEY}Student/GetStudentById?StudentID=${studentId}`)
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
                        })
                        this.DisplayAge(response.data[i].dateOfBirth)
                    }
                }
                else {
                    this.setState({
                        alertBoxObj: {
                            status: true,
                            message: response.data,
                            color: "warningAlert",
                            toggleAlert: this.toggleAlert
                        }
                    })
                }
            })
    }

    SaveStudent() {
        var isExist = "";
        if (this.state.studentId > 0) {
            let newArr = this.state.studentList.filter(std => std.studentId !== this.state.studentId)
            newArr.some(newStd => {
                if (newStd.email === this.state.email || newStd.contactNo === this.state.contactNumber) {
                    return isExist ="Not allowed to duplicate students!";
                } else {
                    return isExist;
                }
            })
        } else {
            this.state.studentList.some(std => {
                if (std.email === this.state.email || std.contactNo === this.state.contactNumber) {
                    return isExist = "Student already Exists!";
                } else {
                    return isExist;
                }
            })

        }

        var isValid = this.ValidateFields();
        if (isValid.length > 0) {
            this.setState({
                alertBoxObj: {
                    status: true,
                    message: isValid,
                    color: "warningAlert",
                    toggleAlert: this.toggleAlert
                }
            })
        } else {
            if (isExist.length > 0) {
                this.setState({
                    alertBoxObj: {
                        status: true,
                        message: isExist,
                        color: "dangerAlert",
                        toggleAlert: this.toggleAlert
                    }
                })
            } else {
                axios.post(`${process.env.REACT_APP_API_KEY}Student/SaveStudent`, {
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
                        this.setState({
                            alertBoxObj: {
                                status: true,
                                message: response.data,
                                color: "successAlert",
                                toggleAlert: this.toggleAlert
                            }
                        })
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
                    this.LoadStudentsToGrid();
                })
            }
            this.SetInitialState()
        }
    }

    ValidateFields() {
        var isValid = "";

        if (this.state.firstName.length === 0 || this.state.lastName.length === 0 || this.state.contactNumber.length === 0
            || this.state.contactPerson.length === 0 || this.state.email.length === 0 || this.state.dob.length === 0
            || this.state.classId === 0) {
            return isValid = "Please provide All the Fields!!";

        } else if (this.state.contactNumber.length > 10 || this.state.contactNumber.length < 10) {
            return isValid = "Please provide a valid Phone Number!!";

        } else if (!validator.isEmail(this.state.email)) {
            return isValid = "Please provide a valid Email!!";

        } else {
            return isValid;
        }
    }

    LoadStudentsToGrid() {
        this.LoadStudentList(() => {
            debugger;
            this.setState({
                gridKey: this.state.gridKey + 1
            })
        });
    }

    SetInitialState() {
        this.setState({
            studentId: 0,
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

    DisplayAge(dob) {
        var birthdate = new Date(dob)
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
                                    onClick={() => { this.SetInitialState() }}
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