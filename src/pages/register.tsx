import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { api } from "~/utils/api";

export default function Register() {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const register = api.user.register.useMutation();

  const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    register.mutate({
      name,
      password,
      username,
      email,
    });
  };

  return (
    <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
      <form onSubmit={handleSubmit}>
        <Input
          onChange={(e) => setName(e.target.value)}
          type="text"
          label="Full Name"
          placeholder="Enter your Full Name"
          value={name}
        />
        <Input
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          label="Username"
          name="username"
          placeholder="Enter your Username"
          value={username}
        />
        <Input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={email}
        />
        <Input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          label="Password"
          placeholder="password"
          value={password}
        />
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}
