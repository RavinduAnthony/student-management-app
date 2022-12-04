import { Component } from "react";
import { TeacherGrid } from "./TeacherGrid";

export class TeacherForm extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <h1>Teacher form here</h1>
                <TeacherGrid/>
            </div>
        )
    }
}