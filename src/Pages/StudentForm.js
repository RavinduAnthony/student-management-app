import { Component } from "react";
import { StudentGrid } from "./StudentGrid";
import AlertBox from "./AlertBox";
import {
    Row, Col, Label, Button, Input, Dropdown, DropdownItem,DropdownMenu,DropdownToggle
} from 'reactstrap';
import axios, { Axios } from "axios";
import { DatePicker } from "reactstrap-date-picker";

export class StudentForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            change: false,
            firstName: '', lastName: '', contactPerson: '', contactNumber: '', email: '', age: '', dob: '',
            studentList: '',
            classList: []
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
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
                <br />
                <Row>
                    <Col md="6" xs="12">
                        <Row>
                            <Col md="4" xs="12">
                                <Label>Contact Person</Label>

                            </Col>

                            <Col md="8" xs="12">
                                <Input
                                    value={this.state.contactPerson}
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
                                <Label>Contact Number</Label>

                            </Col>

                            <Col md="8" xs="12">
                                <Input
                                    value={this.state.contactNumber}
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
                <br />
                <Row>
                    <Col md="6" xs="12">
                        <Row>
                            <Col md="4" xs="12">
                                <Label>Date of Birth</Label>

                            </Col>

                            <Col md="8" xs="12">
                                <Input
                                    type="date"
                                    value={this.state.email}
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
                                <Label>Age</Label>

                            </Col>

                            <Col md="8" xs="12">
                                <Input
                                    value={this.state.age}
                                    onChange={(e) => { this.setState({ className: e.target.value }) }}
                                    disabled
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
                                <Label>Class</Label>

                            </Col>

                            <Col md="8" xs="12">
                                <Dropdown>
                                    <DropdownToggle caret>
                                        Dropdown
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem header>Header</DropdownItem>
                                        <DropdownItem disabled>Action</DropdownItem>
                                        <DropdownItem>Another Action</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem>Another Action</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr/>
                <div>
                    <StudentGrid />
                </div>
            </div>




        )
    }
}