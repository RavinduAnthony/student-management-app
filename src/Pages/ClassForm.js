import React, { Component } from "react";
import AlertBox from "./AlertBox";
import {
    Row, Col, Label, Button, Input
} from 'reactstrap';
import axios from "axios";
import { ClassGrid } from "./ClassGrid";

class ClassForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            classID: 0,
            className: "",
            gridKey: 1,
            classRooms: [],
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

        this.saveClass = this.saveClass.bind(this);
        this.GetClassById = this.GetClassById.bind(this);
        this.DeleteClassRoom = this.DeleteClassRoom.bind(this);
        this.toggleAlert = this.toggleAlert.bind(this);
    }

    componentDidMount() {
        this.loadClassRoomList(() => {
            debugger;
            this.setState({
                gridKey: this.state.gridKey + 1
            })
        });
    }

    loadClassRoomList(callback) {
        axios.get(`https://localhost:44319/ClassRoom/GetAllClassRooms`)
            .then(response => {
                debugger;
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
    }

    GetClassById(classRoomId) {
        axios.get(`https://localhost:44319/ClassRoom/GetClassRoomById?ClassId=` + classRoomId)
            .then(response => {
                if (response.status === 200) {
                    for (let i = 0; i < response.data.length; i++) {
                        this.setState({ className: response.data[i].classRoomName })
                        this.setState({ classID: response.data[i].classRoomId })
                        this.setState({ isUpdating: true })
                    }
                }
                else {
                    this.setState({ alertClassName: "danger" })
                    this.setState({ isShowAlert: true })
                    this.setState({ alertMessage: "Not Found!" })
                }

            })
    }
    DeleteClassRoom(classRoomId) {
        axios.post(`https://localhost:44319/ClassRoom/DeleteClassRoom?ClassId=` + classRoomId)
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
                        color: "success",
                        toggleAlert: this.toggleAlert
                    }
                })
                this.loadClassRoomList(() => {
                    debugger;
                    this.setState({
                        gridKey: this.state.gridKey + 1
                    })
                });
            })
    }
    saveClass() {
        if (this.state.isUpdating) {
            axios.put(`https://localhost:44319/ClassRoom/UpdateClassRoom`, {
                classRoomId: this.state.classID,
                classRoomName: this.state.className
            }).then(response => {
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
                        color: "success",
                        toggleAlert: this.toggleAlert
                    }
                })
                this.loadClassRoomList(() => {
                    debugger;
                    this.setState({
                        gridKey: this.state.gridKey + 1
                    })
                });
            })
        }
        else {
            axios.post(`https://localhost:44319/ClassRoom/SaveClassRoom`, {
                classRoomName: this.state.className
            }).then(response => {
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
                        color: "success",
                        toggleAlert: this.toggleAlert
                    }
                })
                this.loadClassRoomList(() => {
                    debugger;
                    this.setState({
                        gridKey: this.state.gridKey + 1
                    })
                });
            })
        }
        this.setState({ className: "" })
        
        
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

                            <Col md="8" xs="12">
                                <Button outline color="success"
                                    onClick={() => { this.saveClass() }}
                                // onClick={() => {
                                //     this.setState({
                                //         alertBoxObj: {
                                //             status: true,
                                //             message: "Test",
                                //             color: "success",
                                //             toggleAlert: this.toggleAlert
                                //         }
                                //     })
                                // }}
                                >
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className="alertBox" >
                    <AlertBox alertBoxObj={this.state.alertBoxObj}/>
                </div>
                {/* <div className="alertBox" >
                    {this.state.isShowAlert ?
                        (<AlertBox status={this.state.isShowAlert}
                            message={this.state.alertMessage}
                            color={this.state.alertClassName}
                        />)
                        :
                        null
                    }
                </div> */}
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