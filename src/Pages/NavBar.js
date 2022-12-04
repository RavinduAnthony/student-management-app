import { Outlet, Link } from "react-router-dom";
export function NavBar(props){
    return(
        <div>
                <nav className="navbar navbar-expand-lg bg-light">
                    <div className="container-fluid">
                        {/* <a className="navbar-brand" href="#">Student Management System</a> */}
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link style={{textDecoration: 'none'}} to="/">
                                        <a className="nav-link" >Student</a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link style={{textDecoration: 'none'}} to="/teacher">
                                        <a className="nav-link" >Teacher</a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link style={{textDecoration: 'none'}} to="/class">
                                        <a className="nav-link" >Class</a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link style={{textDecoration: 'none'}} to="/subject">
                                        <a className="nav-link" >Subject</a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link style={{textDecoration: 'none'}} to="/studentDetails">
                                        <a className="nav-link" >Student Details</a>
                                    </Link>
                                </li>
                            </ul>
                            
                        </div>
                    </div>
                </nav>
                <Outlet />
            </div>
    )
}