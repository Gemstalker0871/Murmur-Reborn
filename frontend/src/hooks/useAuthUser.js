import React from 'react'
import { useQuery } from "@tanstack/react-query"
import { getAuthUser } from '../lib/api'

const useAuthUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false // Disable retry on failure (like 401)
  });

  return { 
    isLoading, 
    authUser: data?.data?.user // Match your ApiResponse format
  };
};

export default useAuthUser;