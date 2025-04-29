import { NextResponse } from "next/server"
export async function POST(request: Request){
    try {
        const {name,email,password} = await request.json()
        console.log(name,email,password)
        return NextResponse.json({
            message:"User Created Successfully"
        })
    } catch (error){
        console.log(error)
    }
}