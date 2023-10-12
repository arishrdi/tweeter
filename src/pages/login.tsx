import { Button, Divider, Input, Link, button } from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import Google from "~/images/google.svg";
import Logo from "~/images/logo.png";
import NextLink from "next/link";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    await signIn("credentials", { username, password, callbackUrl: "/" });
  };

  const tooglePassword = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="grid h-screen grid-cols-1 place-items-center gap-10 md:grid-cols-2">
      <Image src={Logo} alt="Logo" width={500} height={500} />
      <div className="flex flex-col gap-5">
        <h1 className="mb-6 text-7xl font-bold uppercase tracking-widest">
          Whatsup!!!
        </h1>
        <h3 className="mb-3 text-right text-4xl font-bold">Join Now</h3>
        <div className="flex w-full gap-4">
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
            <Input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              label="Username"
              name="username"
              value={username}
              className="w-full"
            />
            <Input
              onChange={(e) => setPassword(e.target.value)}
              type={isPasswordVisible ? "text" : "password"}
              label="Password"
              value={password}
              endContent={
                <button onClick={tooglePassword} type="button">
                  {isPasswordVisible ? (
                    <Eye size={20} className="text-foreground" />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </button>
              }
            />
            <Button type="submit" color="primary">
              Login
            </Button>
            <div className="-my-3 flex items-center justify-between gap-3">
              <span className="h-[1px] w-full bg-gray-500/25"></span>
              <p className="text-center">or</p>
              <span className="h-[1px] w-full bg-gray-500/25"></span>
            </div>
            <Button
              onClick={() => void signIn("google", {callbackUrl: "/"})}
              variant="flat"
              color="primary"
              startContent={
                <Image src={Google} width={20} height={20} alt="Google" />
              }
            >
              Continue with google
            </Button>
            <p>
              Don&apos;t have an account?{" "}
              <Link as={NextLink} href="/register">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
