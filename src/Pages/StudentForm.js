import { Component } from "react";
import { StudentGrid } from "./StudentGrid";
import axios, { Axios } from "axios";

export class StudentForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            change: false,
            firstName: '', lastName: '', contactPerson: '', contactNumber: '', email: '', age: '', dob: '',
            studentList: '',
            classList: []
        }
        // this.handleChange = this.handleChange.bind(this)
        // this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleSubmit(event) {
        console.log(this.state.firstName + this.state.lastName)
    }
    componentDidMount() {
        axios.get(`https://localhost:44319/student/GetAllStudents`)
            .then(response => {
                this.setState({
                    studentList: response.data
                })
                console.log(this.state.studentList)
            })
        axios.get(`https://localhost:44319/ClassRoom/GetAllClassRooms`)
            .then(response => {
                this.state.classList.push(response.data)
                console.log("Class Rooms: ", this.state.classList)
            })
    }
    render() {
        return (
            <div className="form" >
                <form onSubmit={this.handleSubmit} >
                    <div className="formFields" >
                        <div className="mb-3">
                            <label className="form-label">First Name</label>
                            <input type="text" className="form-control" id="firstName"
                                value={this.state.firstName} name="firstName" onChange={this.handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            <input type="text" className="form-control" id="lastName"
                                value={this.state.lastName} name="lastName" onChange={this.handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Contact Person</label>
                            <input type="text" className="form-control" id="contactPerson"
                                value={this.state.contactPerson} name="contactPerson" onChange={this.handleChange} />
                        </div>
                    </div>
                    <div className="formFields" >
                        <div className="mb-3">
                            <label className="form-label">Contact Number</label>
                            <input type="text" className="form-control" id="contactNumber"
                                value={this.state.contactNumber} name="contactNumber" onChange={this.handleChange} />
                        </div>
                        <div class="mb-3">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-control" id="email"
                                value={this.state.email} name="email" onChange={this.handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Age</label>
                            <input type="Number" className="form-control" id="age"
                                value={this.state.age} name="age" onChange={this.handleChange} />
                        </div>
                    </div>
                    <div className="formFields" >
                        <div className="mb-3">
                            <label className="form-label">Date Of Birth</label>
                            <input type="Date" className="form-control" id="dob"
                                value={this.state.dob} name="dob" onChange={this.handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Classes</label>
                            <br />
                            <select id="classDropdown" className="customSelect" >
                                <option value="none" selected disabled hidden> --Select Class --</option>
                            </select>
                        </div>


                    </div>
                    <div className="formFields">
                        <div className="mb-3" >
                            <button className="btn btn-primary">Submit</button>
                        </div>

                    </div>
                </form>
                <div>
                    <StudentGrid />
                </div>
            </div>




        )
    }
}