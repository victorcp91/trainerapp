import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

export function withAuth(Component: React.ComponentType, isPrivate: boolean) {
  return function AuthWrapper() {
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user && !isPrivate) {
          router.replace("/dashboard");
        } else if (!user && isPrivate) {
          router.replace("/login");
        }
      });

      return () => unsubscribe();
    }, [router]);

    return <Component />;
  };
}
