import loadingIcon from "../resources/loadingIcon.gif"

const PageLoader = () => {
    return(
        <div className="loader-container" >
            <img src={loadingIcon} className = "loader-icon" alt="loading" />
        </div>
    )
}

export default PageLoader;