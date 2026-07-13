import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../Context/UserContext'
import axios from 'axios'

const UserProtectedWrapper = ({ children }) => {
    const navigate = useNavigate()
    const { setuser } = useContext(userDataContext)
    const [isLoading, setIsLoading] = useState(true)

    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [token])

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                if (response.status === 200) {
                    setIsLoading(false)
                    const data = response.data
                    setuser(data)
                }
            })
            .catch((err) => {
                console.log(err.response?.data?.message)
                localStorage.removeItem('token')
                setIsLoading(false)
                navigate('/login')
            })
    }, [token])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            {children}
        </>
    )
}

export default UserProtectedWrapper