import Error403 from "@/components/errors/403-page"
import { useAppSelector } from "@/context/hooks"
import { Navigate } from "react-router-dom"


const RoleCheck = (props) => {
    const isAdmin = window.location.pathname.startsWith("/admin")
    const user = useAppSelector(state => state.account.user)
    const userRole = user?.role?.name
    if (isAdmin && userRole === 'ADMIN' || !isAdmin && (userRole === 'USER' || userRole === 'ADMIN')) {
        return (<>{props.children}</>)
    } else {
        return (<Error403 />)
    }
}

const ProtectedRoute = (props) => {
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated)
    return (
        <>
            {isAuthenticated === true ?
                <>
                    <RoleCheck>{props.children}</RoleCheck>
                </> : <Navigate to="/login" replace />
            }
        </>
    )
}
export default ProtectedRoute;