"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
    } else if (user) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🎓</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
