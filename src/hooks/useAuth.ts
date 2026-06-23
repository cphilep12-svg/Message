import { useCallback } from "react";
import { trpc } from "@/providers/trpc";

export function useAuth() {
  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const isAdmin = user?.role === "admin";

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    logout,
  };
}
