import {useDispatch} from "react-redux"
import { register,login,getMe, logout } from "../services/auth.api"
import { setUser,setError,setLoading, logoutUser } from "../auth.slice"

export function useAuth(){
  const dispatch = useDispatch()

  async function handleRegister({email, username, password}){
    try{
      dispatch(setLoading(true))
      const data = await register({email, username, password})
    }
    catch(err){
      dispatch(setError(err.response.data.message || "Registration failed"))
    }
    finally{
      dispatch(setLoading(false))
    }
  }

  async function handleLogin({email, password}){
    try{
      dispatch(setLoading(true))
      const data = await login({email, password})
      dispatch(setUser(data.user))
    }
    catch(err){
      dispatch(setError(err.response.data.message || "Login failed"))
    }
    finally{
      dispatch(setLoading(false))
    }
  }

  async function handleGetMe(){
    try{
      dispatch(setLoading(true))
      const data = await getMe()
      dispatch(setUser(data.user))
    }
    catch(err){
      dispatch(setError(err.response.data.message || "Failed to fetch user data"))
    }
    finally{
      dispatch(setLoading(false))
    }
  }

  async function handleLogout(){
    try{
      dispatch(setLoading(true))
      await logout()
      dispatch(logoutUser())
    }
    catch(err){
      dispatch(setError(err.response?.data?.message || "Failed to logout"))
    }
    finally{
      dispatch(setLoading(false))
    }
  }

  return{
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout
  }
}