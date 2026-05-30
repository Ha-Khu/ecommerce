import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom"

function Register(){
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  async function handleRegister(){
    try{
      await axios.post("http://localhost:5000/api/auth/register", {firstName, lastName, email, password})
      navigate("/login")
    }catch(err){
      setError("Registration Failed, please try again")
    }
  }

  return(
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Jacob"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Vance"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="jacob@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="*******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p>{error}</p>}
        <Button onClick={handleRegister}>Register</Button>
      </CardContent>
    </Card>
  )
}

export default Register