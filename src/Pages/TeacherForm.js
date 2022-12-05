import { Component } from "react";
import {
    Row, Col, Label, Button, Input, Dropdown, DropdownItem,DropdownMenu,DropdownToggle
} from 'reactstrap';
import { TeacherGrid } from "./TeacherGrid";

export class TeacherForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            firstName: '', lastName: '', conNumber: '', email: '',
            teacherList:[],
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
    }

    render(){
        return(
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
                                    onChange={(e) => { this.setState({ className: e.target.value }) }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col md="6" xs="12">
                        <Row>
                            <Col md="4" xs="12">
                                <Label>Last Name</Label>

                            </Col>

                            <Col md="8" xs="12">
                                <Input
                                    value={this.state.lastName}
                                    onChange={(e) => { this.setState({ className: e.target.value }) }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col md="6" xs="12">
                        <Row>
                            <Col md="4" xs="12">
                                <Label>Contact Number</Label>

                            </Col>

                            <Col md="8" xs="12">
                                <Input
                                    value={this.state.conNumber}
                                    onChange={(e) => { this.setState({ className: e.target.value }) }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col md="6" xs="12">
                        <Row>
                            <Col md="4" xs="12">
                                <Label>Email Address</Label>

                            </Col>

                            <Col md="8" xs="12">
                                <Input
                                    value={this.state.email}
                                    onChange={(e) => { this.setState({ className: e.target.value }) }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr/>
                <br/>
                <TeacherGrid/>
            </div>
            
        )
    }
}