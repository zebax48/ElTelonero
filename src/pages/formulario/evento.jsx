import CrearEvento from "@/components/AdminPage/CrearEvento";
import { useAuth } from "@/Auth/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function EventoPage() {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.token) {
      router.push('/auth/login');
    }
  }, [auth, router]);

  return (
    
      <CrearEvento />

  );
}