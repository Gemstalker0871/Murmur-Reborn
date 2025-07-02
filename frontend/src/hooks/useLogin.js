import { login } from '../lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useLogin = () => {
  const queryClient = useQueryClient();

  const { mutate: loginMutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    }
  });

  return { error, isPending, loginMutation: loginMutate };
}

export default useLogin;
