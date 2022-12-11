import React, { Component } from "react";
import AlertBox from "./AlertBox";
import {
    Row, Col, Label, Button, Input
} from 'reactstrap';
import axios from "axios";
import ClassGrid from "./ClassGrid";

class ClassForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            classID: 0,
            className: "",
            gridKey: 1,
            classRooms: [],
            students: [],
            alertBoxObj: {
                status: false,
                message: "",
                color: "success",
                toggleAlert: () => { }
            }
        }

        this.saveClass = this.saveClass.bind(this);
        this.GetClassById = this.GetClassById.bind(this);
        this.DeleteClassRoom = this.DeleteClassRoom.bind(this);
        this.toggleAlert = this.toggleAlert.bind(this);
        this.setInitialState = this.setInitialState.bind(this);
        this.LoadClassRoomsToGrid = this.LoadClassRoomsToGrid.bind(this);
        this.ValidateFields = this.ValidateFields.bind(this);
        this.StudentAvailability = this.StudentAvailability.bind(this);
    }

    componentDidMount() {
        this.loadClassRoomList(() => {
            this.setState({
                gridKey: this.state.gridKey + 1
            })
        });
    }

    loadClassRoomList(callback) {
        axios.get(`${process.env.REACT_APP_API_KEY}ClassRoom/GetAllClassRooms`)
            .then(response => {
                this.setState({
                    classRooms: response.data.map(item => {
                        return {
                            classRoomId: item.classRoomId,
                            classRoomName: item.classRoomName
                        }
                    })
                })

                callback(true);
            })
        axios.get(`${process.env.REACT_APP_API_KEY}Student/GetAllStudents`)
            .then(response => {
                this.setState({
                    students: response.data.map(std => {
                        return {
                            studentId: std.studentId,
                            firstName: std.firstName,
                            lastName: std.lastName,
                            contactPerson: std.contactPerson,
                            contactNo: std.contactNo,
                            email: std.email,
                            dateOfBirth: std.dateOfBirth,
                            st_classRoomId: parseInt(std.classId),
                            classRoomName: std.classRoomName
                        }
                    })
                })
                callback(true);
            })
    }

    GetClassById(classRoomId) {
        axios.get(`${process.env.REACT_APP_API_KEY}ClassRoom/GetClassRoomById?ClassId=${classRoomId}`)
            .then(response => {
                if (response.status === 200) {
                    for (let i = 0; i < response.data.length; i++) {
                        this.setState({
                            className: response.data[i].classRoomName,
                            classID: response.data[i].classRoomId
                        })
                    }
                }
                else {
                    this.setState({
                        alertBoxObj: {
                            status: true,
                            message: "Student Not Found!",
                            color: "dangerAlert",
                            toggleAlert: this.toggleAlert
                        }
                    })
                }

            })
    }

    DeleteClassRoom(classRoomId,classRoomName) {
        let isAvailable = this.StudentAvailability(classRoomName)

        if (!isAvailable.isValid) {
            this.setState({
                alertBoxObj: {
                    status: true,
                    message: isAvailable.errorMessage,
                    color: "warningAlert",
                    toggleAlert: this.toggleAlert
                }
            })
        } else {
            axios.post(`${process.env.REACT_APP_API_KEY}ClassRoom/DeleteClassRoom?ClassId=${classRoomId}`)
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

                    this.LoadClassRoomsToGrid()
                })
        }

    }

    saveClass() {

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
            axios.post(`${process.env.REACT_APP_API_KEY}ClassRoom/SaveClassRoom`, {
                classRoomId: parseInt(this.state.classID),
                classRoomName: this.state.className
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

                this.LoadClassRoomsToGrid()
            })

            this.setInitialState();
        }
    }

    ValidateFields() {

        let validObj = {
            isValid: true,
            errorMessage: ""
        }

        if (this.state.className.length === 0) {
            validObj.isValid = false;
            validObj.errorMessage = "Please provide a class";
        }

        let exist = this.state.classRooms.find(x => x.classRoomId != this.state.classID &&
            x.classRoomName.
                replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().replace(/\s+/g, '') ==
            this.state.className.replace(/[^a-zA-Z0-9 ]/g, "").
                toLowerCase().replace(/\s+/g, ''));

        if (exist != null) {
            validObj.isValid = false;
            validObj.errorMessage = "Class Already Exists!!";
        }

        return validObj;
    }

    StudentAvailability(classRoomName) {
        let validObj = {
            isValid: true,
            errorMessage: ""
        }

        let isAvailable = this.state.students.find(x => 
            x.classRoomName.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().replace(/\s+/g, '') == 
            classRoomName.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().replace(/\s+/g, ''))

        if (isAvailable != null) {
            validObj.isValid = false;
            validObj.errorMessage = "Students already allocated to this Class!!"
        }

        return validObj;
    }
    setInitialState() {
        this.setState({
            className: "",
            classID: 0,
        })
    }

    LoadClassRoomsToGrid() {
        this.loadClassRoomList(() => {
            debugger;
            this.setState({
                gridKey: this.state.gridKey + 1
            })
        });
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

    render() {
        return (
            <div>
                <hr />
                <Row>
                    <Col md="6" xs="12">
                        <Row>
                            <Col md="4" xs="12">
                                <Label>Class Room</Label>

                            </Col>

                            <Col md="8" xs="12">
                                <Input
                                    value={this.state.className}
                                    onChange={(e) => { this.setState({ className: e.target.value }) }}
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
                                    onClick={() => { this.saveClass() }}
                                >
                                    Save
                                </Button>
                            </Col>
                            <Col md="2" xs="12">
                                <Button outline color="secondary"
                                    onClick={() => { this.setInitialState() }}
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
                <div className="GridData" >
                    <ClassGrid
                        key={this.state.gridKey}
                        classData={this.state.classRooms}
                        updateMothod={this.GetClassById}
                        DeleteMethod={this.DeleteClassRoom} />
                </div>


            </div>
        )
    }
}

export default ClassForm;