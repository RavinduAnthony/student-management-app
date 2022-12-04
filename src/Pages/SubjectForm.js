import axios from "axios";
import { Component } from "react"
import {
    Row, Col, Label, Button, Input
} from 'reactstrap';
import { AlertBox } from "./AlertBox";
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
            isUpdating: false
        }
        this.SaveSubject = this.SaveSubject.bind(this)
        this.GetSubjectById = this.GetSubjectById.bind(this)
        this.DeleteSubject = this.DeleteSubject.bind(this)
    }
    componentDidMount() {
        axios.get(`https://localhost:44319/Subject/GetAllSubjects`)
            .then(response => {
                for (let i = 0; i < response.data.length; i++) {
                    this.state.subjects.push(response.data[i])
                    this.setState({ subjects: this.state.subjects })
                }
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
                this.setState({ isShowAlert: true })
                this.setState({ alertMessage: response.data })
                this.state.subjects.length = 0;
                this.componentDidMount()
            })
    }
    SaveSubject() {
        if (this.state.isUpdating) {
            axios.put(`https://localhost:44319/Subject/UpdateSubject`, {
                subjectId: this.state.subjectID,
                subjectName: this.state.subjectName
            }).then(response => {
                if (response.status === 200) {
                    this.setState({ alertClassName: "primary" })
                }
                else {
                    this.setState({ alertClassName: "danger" })
                }
                this.setState({ isShowAlert: true })
                this.setState({ alertMessage: response.data })
                this.state.subjects.length = 0;
                this.componentDidMount()
            })
        } else {
            axios.post(`https://localhost:44319/Subject/SaveSubject`, {
                subjectName: this.state.subjectName
            }).then(response => {
                if (response.status === 200) {
                    this.setState({ alertClassName: "primary" })
                }
                else {
                    this.setState({ alertClassName: "danger" })
                }
                this.setState({ isShowAlert: true })
                this.setState({ alertMessage: response.data })
                this.state.subjects.length = 0;
                this.componentDidMount()
            })
        }
        this.setState({subjectName: ""})
        this.setState({ isShowAlert: false })
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
                                    onChange={(e) => { this.setState({ subjectName: e.target.value }) }}
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
                    <SubjectGrid subjectData={this.state.subjects}
                        updateMothod={this.GetSubjectById}
                        DeleteMethod={this.DeleteSubject}
                    />
                </div>
            </div>
        )
    }

}