import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Stack } from "@/shared/ui/Stack/";
import { Input } from "@/shared/ui/Input/Input";
import { Button } from "@/shared/ui/Button";
import { Typography } from "@/shared/ui/Typography";
import { getRouteAdmin } from "@/shared/lib/getRoutes/getRoutes";
import { useAuth } from "../../AdminAuth/model/useAuth";
import { useLoginAdminMutation } from "../../AdminAuth/api/authApi";
import styles from "./AdminLoginForm.module.scss";

interface AdminLoginFormValues {
  username: "";
  password: "";
}

export const AdminLoginForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginAdmin, { isLoading, error }] = useLoginAdminMutation();

  const onSubmit = async (data: AdminLoginFormValues) => {
    try {
      const response = await loginAdmin(data).unwrap();

      if (response.username) {
        login(response);
        navigate(getRouteAdmin());
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const isFetchError = (error as any)?.status === "FETCH_ERROR";
  const isAuthError = error && !isFetchError;

  return (
    <Stack justify="center" align="center" className={styles.authContainer}>
      <Stack
        direction="column"
        justify="center"
        align="center"
        gap={16}
        className={styles.formWrapper}
      >
        <form onSubmit={handleSubmit(onSubmit)} className={styles.mainContent}>
          <Stack direction="column" justify="center" align="center" gap={16}>
            <Stack direction="row" justify="end" max>
              <Typography variant="h1" className={styles.welcomeText}>
                Welcome
              </Typography>
            </Stack>

            {isFetchError && (
              <Typography as="span" className={styles.errorText}>
                Server connection error
              </Typography>
            )}

            {isAuthError && (
              <Typography as="span" className={styles.errorText}>
                Invalid username or password
              </Typography>
            )}

            <Typography variant="body14">
              Please log in to access your admin dashboard and manage the system
              effectively.
            </Typography>

            <Input
              type="text"
              label="Login"
              className={styles.input}
              max
              isError={!!errors.username}
              errorMessage={errors.username?.message}
              register={register("username", {
                required: "Username is required",
              })}
            />

            <Input
              type="password"
              label="Password"
              className={styles.input}
              max
              isError={!!errors.password}
              errorMessage={errors.password?.message}
              register={register("password", {
                required: "Password is required",
              })}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              Sign in
            </Button>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
};
