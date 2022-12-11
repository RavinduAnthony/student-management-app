import { Component } from "react";
import {
    Row, Col, Label, Button, Input
} from 'reactstrap';
import TeacherGrid from "./TeacherGrid";
import AlertBox from "./AlertBox";
import validator from 'validator';
import isEmail from 'validator/lib/isEmail';
import axios from "axios";

export class TeacherForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            teacherId: 0,
            firstName: '',
            lastName: '',
            conNumber: '',
            email: '',
            teacherList: [],
            gridKey: 1,
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
        this.ValidateFields = this.ValidateFields.bind(this)
        this.LoadTeachersToGrid = this.LoadTeachersToGrid.bind(this)
    }

    componentDidMount() {
        this.LoadTeachersToGrid()
    }

    LoadTeacherList(callback) {
        axios.get(`${process.env.REACT_APP_API_KEY}Teacher/GetAllTeachers`)
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
        axios.get(`${process.env.REACT_APP_API_KEY}Teacher/GetTeacherByID?TeacherId=${teacherId}`)
            .then(response => {
                if (response.status === 200) {
                    for (let i = 0; i < response.data.length; i++) {
                        this.setState({
                            teacherId: response.data[i].teacherId,
                            firstName: response.data[i].teacherFirstName,
                            lastName: response.data[i].teacherLastName,
                            conNumber: response.data[i].contactNo,
                            email: response.data[i].email,
                        })
                    }
                }
                else {
                    this.setState({
                        alertBoxObj: {
                            status: false,
                            message: "Teacher Not Found!",
                            color: "dangerAlert",
                            toggleAlert: () => { }
                        }
                    })
                }

            })
    }

    DeleteTeacher(teacherId) {
        axios.post(`${process.env.REACT_APP_API_KEY}Teacher/DeleteTeacher?TeacherId=${teacherId}`)
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

                this.LoadTeachersToGrid();
            })
    }

    SaveTeacher() {
        
        var isValid = this.ValidateFields();

        if (!isValid.isValid) {
            this.setState({
                alertBoxObj: {
                    status: true,
                    message: isValid.errorMessage,
                    color: "warningAlert",
                    toggleAlert: this.toggleAlert
                }
            })
        } else {
            axios.post(`${process.env.REACT_APP_API_KEY}Teacher/SaveTeacher`, {
                teacherId: parseInt(this.state.teacherId),
                teacherFirstName: this.state.firstName,
                teacherLastName: this.state.lastName,
                contactNo: this.state.conNumber,
                email: this.state.email
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

                this.LoadTeachersToGrid();
            })
        }
        this.SetInitialState()

    }

    LoadTeachersToGrid() {
        this.LoadTeacherList(() => {
            debugger;
            this.setState({
                gridKey: this.state.gridKey + 1
            })
        });
    }

    ValidateFields() {

        let validObj = {
            isValid: true,
            errorMessage: ""
        }

        if (this.state.firstName.length === 0 || this.state.lastName.length === 0 ||
            this.state.conNumber.length === 0 || this.state.email.length === 0) {
            validObj.isValid = false;
            validObj.errorMessage = "Please provide All the Fields!!";
        } else if (this.state.conNumber.length > 10 || this.state.conNumber.length < 10) {
            validObj.isValid = false;
            validObj.errorMessage = "PLease Privide a Valid Phone Number!";
        } else if (!validator.isEmail(this.state.email)) {
            validObj.isValid = false;
            validObj.errorMessage = "Please provide a valid Email!!";
        }

        if (this.state.teacherId > 0) {
            let newArr = this.state.teacherList.filter(std => std.teacherId !== this.state.teacherId)
            newArr.some(newTch => {
                if (newTch.email === this.state.email || newTch.contactNo === this.state.conNumber) {
                    validObj.isValid = false;
                    validObj.errorMessage = "Not allowed to duplicate teachers!";
                }
            })
        } else {
            this.state.teacherList.some(tch => {
                if (tch.email === this.state.email || tch.contactNo === this.state.conNumber) {
                    validObj.isValid = false;
                    validObj.errorMessage = "Teacher already Exists!";
                }
            })

        }
        return validObj;
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

                            <Col md="2" xs="12">
                                <Button outline color="success"
                                    onClick={() => { this.SaveTeacher() }}
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
                <TeacherGrid
                    key={this.state.gridKey}
                    teacherData={this.state.teacherList}
                    updateMothod={this.GetTeacherById}
                    DeleteMethod={this.DeleteTeacher} />
            </div>

        )
    }
}