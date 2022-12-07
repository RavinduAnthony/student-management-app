import { Component } from "react";
import {
    Row, Col, Label, Button, Input
} from 'reactstrap';
import { TeacherGrid } from "./TeacherGrid";
import AlertBox from "./AlertBox";
import validator from 'validator';
import isEmail from 'validator/lib/isEmail';
import axios from "axios";

export class TeacherForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            teacherId: 0, firstName: '', lastName: '', conNumber: '', email: '',
            teacherList: [],
            gridKey: 1,
            isShowAlert: false,
            alertMessage: "",
            alertClassName: "",
            isUpdating: false,
            alertBoxObj: {
                status: false,
                message: "",
                color: "success",
                toggleAlert: () => { }
            }
        }
        this.LoadTeacherList = this.LoadTeacherList.bind(this)
        this.GetTeacherById = this.GetTeacherById.bind(this)
        this.HandleChange = this.HandleChange.bind(this)
        this.SaveTeacher = this.SaveTeacher.bind(this)
        this.toggleAlert = this.toggleAlert.bind(this)
        this.DeleteTeacher = this.DeleteTeacher.bind(this)
        this.SetInitialState = this.SetInitialState.bind(this)
    }

    componentDidMount() {
        this.LoadTeacherList(() => {
            this.setState({
                gridKey: this.state.gridKey + 1
            })
        });
    }
    
    LoadTeacherList(callback) {
        axios.get(`https://localhost:44319/Teacher/GetAllTeachers`)
            .then(response => {
                this.setState({
                    teacherList: response.data.map(item => {
                        return {
                            teacherId: item.teacherId,
                            teacherFirstName: item.teacherFirstName,
                            teacherLastName: item.teacherLastName,
                            contactNo: item.contactNo,
                            email: item.email
                        }
                    })
                })
                callback(true);
            })
    }
    
    GetTeacherById(teacherId) {
        axios.get(`https://localhost:44319/Teacher/GetTeacherByID?TeacherId=` + teacherId)
            .then(response => {
                if (response.status === 200) {
                    for (let i = 0; i < response.data.length; i++) {
                        this.setState({
                            teacherId: response.data[i].teacherId,
                            firstName: response.data[i].teacherFirstName,
                            lastName: response.data[i].teacherLastName,
                            conNumber: response.data[i].contactNo,
                            email: response.data[i].email,
                            isUpdating: true
                        })
                    }
                }
                else {
                    this.setState({
                        alertClassName: "danger",
                        isShowAlert: true,
                        alertMessage: "Not Found!"
                    })
                }

            })
    }
    
    DeleteTeacher(teacherId) {
        axios.post(`https://localhost:44319/Teacher/DeleteTeacher?TeacherId=` + teacherId)
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
                this.LoadTeacherList(() => {
                    debugger;
                    this.setState({
                        gridKey: this.state.gridKey + 1
                    })
                });
            })
    }
    
    SaveTeacher() {
        const teacherAvailability = this.state.teacherList.some(tch => {
            if (tch.email === this.state.email || tch.contactNo === this.state.conNumber) {
                return true;
            } else {
                return false;
            }
        })
        if (this.state.firstName.length === 0 || this.state.lastName.length === 0 ||
            this.state.conNumber.length === 0 || this.state.email.length === 0) {
            this.setState({
                alertBoxObj: {
                    status: true,
                    message: "Please provide All the Fields!!",
                    color: "warningAlert",
                    toggleAlert: this.toggleAlert
                }
            })
        } else if (this.state.conNumber.length > 10 || this.state.conNumber.length < 10) {
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

            if (this.state.teacherId === 0 && teacherAvailability) {
                this.setState({
                    alertBoxObj: {
                        status: true,
                        message: "Teacher Already Exists!",
                        color: "dangerAlert",
                        toggleAlert: this.toggleAlert
                    }
                })

            } else {
                axios.post(`https://localhost:44319/Teacher/SaveTeacher`, {
                    teacherId: parseInt(this.state.teacherId),
                    teacherFirstName: this.state.firstName,
                    teacherLastName: this.state.lastName,
                    contactNo: this.state.conNumber,
                    email: this.state.email
                }).then(response => {
                    if (response.status === 200) {
                        this.setState({ alertClassName: "primary" })
                    }
                    else {
                        this.setState({ alertClassName: "danger" })
                    }
                    this.setState({ isUpdating: false })
                    this.setState({
                        alertBoxObj: {
                            status: true,
                            message: response.data,
                            color: "successAlert",
                            toggleAlert: this.toggleAlert
                        }
                    })
                    this.LoadTeacherList(() => {
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
            teacherId: 0,
            lastName: "",
            conNumber: "",
            email: ""
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
    
    HandleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
            alertBoxObj: {
                status: false,
                message: "",
                color: "success",
                toggleAlert: () => { }
            }
        })
    }
    render() {
        return (
            <div>
                <hr />
                <Row>
                    <Col md="6" xs="12">
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
                </Row>
                <br />
                <Row>
                    <Col md="6" xs="12">
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
                    <Col md="6" xs="12">
                        <Row>
                            <Col md="4" xs="12">
                                <Label>Contact Number</Label>

                            </Col>

                            <Col md="8" xs="12">
                                <Input
                                    value={this.state.conNumber}
                                    name="conNumber"
                                    onChange={this.HandleChange}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col md="6" xs="12">
                        <Row>
                            <Col md="4" xs="12">
                                <Label>Email Address</Label>

                            </Col>

                            <Col md="8" xs="12">
                                <Input
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
                    <Col md="6" xs="12">
                        <Row>
                            <Col md="4" xs="12">

                            </Col>

                            <Col md="8" xs="12">
                                <Button outline color="success"
                                    onClick={() => { this.SaveTeacher() }}
                                >
                                    Save
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
                <TeacherGrid
                    key={this.state.gridKey}
                    teacherData={this.state.teacherList}
                    updateMothod={this.GetTeacherById}
                    DeleteMethod={this.DeleteTeacher} />
            </div>

        )
    }
}