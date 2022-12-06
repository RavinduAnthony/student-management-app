import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudentForm } from "./Pages/StudentForm";
import { NavBar } from "./Pages/NavBar";
import { TeacherForm } from "./Pages/TeacherForm";
import ClassForm from "./Pages/ClassForm";
import { SubjectForm } from "./Pages/SubjectForm";
import StudentDetails from "./Pages/StudentDetails";
import AllocateClass from "./Pages/AllocateClass";
import AllocateSubject from "./Pages/AllocateSubject";
class App extends Component {

    render() {
        return (
            <div>

                <BrowserRouter>
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<NavBar />} />
                        <Route index element={<StudentForm />} />
                        <Route path="/teacher" element={<TeacherForm />} />
                        <Route path="/class" element={<ClassForm />} />
                        <Route path="/subject" element={<SubjectForm />} />
                        <Route path="/allocateClass" element={<AllocateClass />} />
                        <Route path="/allocateSubject" element={<AllocateSubject />} />
                        <Route path="/studentDetails" element={<StudentDetails />} />
                    </Routes>
                </BrowserRouter>
            </div>
        )
    }
}

export default App