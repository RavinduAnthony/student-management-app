import React, { Component } from "react";
import { AlertBox } from "./AlertBox";
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
            classRooms: [],
            isShowAlert: false,
            alertMessage: "",
            alertClassName: "",
            isUpdating: false
        }

        this.saveClass = this.saveClass.bind(this);
        this.GetClassById = this.GetClassById.bind(this);
        this.DeleteClassRoom = this.DeleteClassRoom.bind(this)
    }

    componentDidMount() {
        axios.get(`https://localhost:44319/ClassRoom/GetAllClassRooms`)
            .then(response => {
                for (let i = 0; i < response.data.length; i++) {
                    this.state.classRooms.push(response.data[i])
                    this.setState({ classRooms: this.state.classRooms })
                }
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
                this.setState({ isShowAlert: true })
                this.setState({ alertMessage: response.data })
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
                this.setState({ isShowAlert: true })
                this.setState({ alertMessage: response.data })
                this.state.classRooms.length = 0
                this.componentDidMount()
            })

        }
        else {
            axios.post(`https://localhost:44319/ClassRoom/SaveClassRoom`, {
                classRoomName: this.state.className
            }).then(response => {
                if (response.status === 200) {
                    this.setState({ alertClassName: "primary" })
                    this.setState({ classRooms: [] })
                }
                else {
                    this.setState({ alertClassName: "danger" })
                }
                this.setState({ isShowAlert: true })
                this.setState({ alertMessage: response.data })
                this.state.classRooms.length = 0
                this.componentDidMount()

            })
        }
        this.setState({ className: "" })
        this.setState({ isShowAlert: false })
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
                                >
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <div className="alertBox" >
                    {this.state.isShowAlert ?
                        (<AlertBox status={this.state.isShowAlert}
                            message={this.state.alertMessage}
                            color={this.state.alertClassName}
                        />)
                        :
                        null
                    }
                </div>
                <hr />
                <div className="GridData" >
                    <ClassGrid classData={this.state.classRooms}
                        updateMothod={this.GetClassById}
                        DeleteMethod={this.DeleteClassRoom} />
                </div>


            </div>
        )
    }
}

export default ClassForm;