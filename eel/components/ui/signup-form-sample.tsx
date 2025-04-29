"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import axios from "axios";
export function SignupFormSample() {
  //add state variables for name, email, password, confirm
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword,setShowPassword] = useState(false)
  const [showConfirm,setShowConfirm] = useState(false)

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      const res = await axios.post("/api/v1/signup",{
        name,
        email,
        password
      })
      console.log(res.data.message)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
        <CardContent className="space-y-4">
        {/* name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" value={name} onChange={(e)=>{
              setName(e.target.value)
            }} />
          </div>

          {/* email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value = {email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          {/* password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4"/>
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Input
              id="password"
              type={showPassword ? "text":"password"}
              placeholder="••••••••"
              value = {password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

                {/* show confirm */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                                {showConfirm ? (
                  <EyeOff className="h-4 w-4"/>
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              type={showConfirm ? "text":"password"}
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
            />
          </div>

        </CardContent>

        <CardFooter className="pt-4">
          <Button type="submit" className="w-full" onClick={handleSubmit}>
           Create Account
          </Button>
        </CardFooter>
    </Card>
  )
}