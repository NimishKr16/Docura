"use client"
"use client"
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = "/login";
      } else {
        setUser(user);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully!');
    window.location.href = "/login";
  };

  if (user) {
    return (
      <div>
        <Navbar />
        {/* <div>Welcome</div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          style={{ marginTop: 16 }}
        >
          Logout
        </Button> */}
        <ToastContainer />
      </div>
    );
  }

  return null;
}
