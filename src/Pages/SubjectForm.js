import axios from "axios";
import { Component } from "react"
import {
    Row, Col, Label, Button, Input
} from 'reactstrap';
import AlertBox from "./AlertBox";
import { SubjectGrid } from "./SubjectGrid"

export class SubjectForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subjectID: 0,
            subjectName: "",
            subjects: [],
            isShowAlert: false,
            alertMessage: "",
            alertClassName: "",
            isUpdating: false,
            gridKey: 1,
            alertBoxObj: {
                status: false,
                message: "",
                color: "success",
                toggleAlert: () => { }
            }
        }
        this.SaveSubject = this.SaveSubject.bind(this);
        this.GetSubjectById = this.GetSubjectById.bind(this);
        this.DeleteSubject = this.DeleteSubject.bind(this);
        this.toggleAlert = this.toggleAlert.bind(this);
        this.setInitialState = this.setInitialState.bind(this);
        this.HandleChange = this.HandleChange.bind(this);

    }
    componentDidMount() {
        this.LoadSubjectList(() => {
            debugger;
            this.setState({
                gridKey: this.state.gridKey + 1
            })
        });
    }

    LoadSubjectList(callback) {
        axios.get(`https://localhost:44319/Subject/GetAllSubjects`)
            .then(response => {
                this.setState({
                    subjects: response.data.map(item => {
                        return {
                            subjectId: item.subjectId,
                            subjectName: item.subjectName
                        }
                    })
                })

                callback(true);
            })
    }

    GetSubjectById(sbjId) {
        axios.get(`https://localhost:44319/Subject/GetSubjectById?SubjectId=` + sbjId)
            .then(response => {
                if (response.status === 200) {
                    for (let i = 0; i < response.data.length; i++) {
                        this.setState({ subjectName: response.data[i].subjectName })
                        this.setState({ subjectID: response.data[i].subjectId })
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

    DeleteSubject(sbjId) {
        axios.post(`https://localhost:44319/Subject/DeleteSubject?SubjectId=` + sbjId)
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
                this.LoadSubjectList(() => {
                    debugger;
                    this.setState({
                        gridKey: this.state.gridKey + 1
                    })
                });
            })
    }

    SaveSubject() {
        const subjectAvailability = this.state.subjects.some(item => {
            var newSubject = this.state.subjectName.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().replace(/\s+/g, '')
            var existingSubject = item.subjectName.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().replace(/\s+/g, '')
            if (existingSubject === newSubject) {
                return true;
            } else {
                return false;
            }
        })
        if (this.state.subjectName.length === 0) {
            this.setState({
                alertBoxObj: {
                    status: true,
                    message: "Please provide Subject Name!!",
                    color: "warningAlert",
                    toggleAlert: this.toggleAlert
                }
            })
        } else {
            if (this.state.subjectID === 0 && subjectAvailability) {
                this.setState({
                    alertBoxObj: {
                        status: true,
                        message: "Subject already exists!",
                        color: "dangerAlert",
                        toggleAlert: this.toggleAlert
                    }
                })
            } else {
                axios.post(`https://localhost:44319/Subject/SaveSubject`, {
                    subjectId: parseInt(this.state.subjectID),
                    subjectName: this.state.subjectName
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
                            color: "successAlert",
                            toggleAlert: this.toggleAlert
                        }
                    })
                    this.LoadSubjectList(() => {
                        this.setState({
                            gridKey: this.state.gridKey + 1
                        })
                    });
                })
            }
            this.setInitialState();
        }

    }

    setInitialState() {
        this.setState({
            subjectName: "",
            subjectID: 0
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

    HandleChange(e){
        this.setState({ 
            subjectName: e.target.value,
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
                <Row>
                    <Col md="6" xs="12">
                        <Row>
                            <Col md="4" xs="12">
                                <Label>Subject</Label>

                            </Col>

                            <Col md="8" xs="12">
                                <Input
                                    value={this.state.subjectName}
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
                                    onClick={() => { this.SaveSubject() }}
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
                <div className="GridData" >
                    <SubjectGrid
                        key={this.state.gridKey}
                        subjectData={this.state.subjects}
                        updateMothod={this.GetSubjectById}
                        DeleteMethod={this.DeleteSubject}
                    />
                </div>
            </div>
        )
    }

}