"use client";

import supabase from "@/lib/db";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export interface User {
  id: string;
  username: string;
  inGameName: string;
  email: string;
}

export const UserContext = createContext<any>(null);

function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const session = await supabase.auth.getSession();
      if (session) {
        const { data: authData, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user from auth:", error);
          router.push("/login");
        } else {
          const userId = authData.user.id; // Extract ID from auth response

          try {
            const { data: userData, error } = await supabase
              .from("users")
              .select("*")
              .eq("id", userId);
            console.log(userData);

            if (error) {
              console.error("Error fetching user from users table:", error);
            } else {
              setUser(userData[0] as User); // Cast as User and set state
            }
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export default UserProvider;
