import { useState } from "react"
import PageLoader from "./PageLoader"

const usePageLoader = () => {
    const [loading, setLoading] = useState(false)
    
    return[
        loading ? <PageLoader/> : null,
        () => setLoading(true),
        () => setLoading(false)
    ]
}

export default usePageLoader;