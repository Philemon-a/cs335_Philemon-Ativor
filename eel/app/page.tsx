import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignupFormSample } from "@/components/ui/signup-form-sample";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="text-3xl font-bold">Welcome</p>
          <p className="text-sm">Sign in to your account or create a new one</p>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>
          <TabsContent value="login">Make changes to your account here.</TabsContent>
          <TabsContent value="signup">
            <SignupFormSample />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}