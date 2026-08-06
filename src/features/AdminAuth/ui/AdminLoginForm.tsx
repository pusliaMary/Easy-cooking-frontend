import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import logo from "@/shared/assets/images/logo.webp";

import { Stack } from '@/shared/ui/Stack/';
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import styles from './AdminLoginForm.module.scss';
import { useAuth } from '../../AdminAuth/model/useAuth';
import { useLoginAdminMutation } from '../../AdminAuth/api/authApi';
import { Typography } from '@/shared/ui/Typography';
import { getRouteAdmin } from '@/shared/lib/getRoutes/getRoutes';

export const AdminLoginForm = () => {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm({
        defaultValues: {
            username: '',
            password: ''
        },
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    const [loginAdmin, { isLoading, error }] = useLoginAdminMutation();

const onSubmit = async (data) => {
        try {
            const response = await loginAdmin(data).unwrap();

            if (response.accessToken) {
                Cookies.set('authToken', response.accessToken);
                login(response);
                navigate(getRouteAdmin());
            }
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    return (
        <Stack 
            justify="center" 
            align="center" 
            className={styles.authContainer}
        >
            <Stack 
                direction="column" 
                justify="center" 
                align="center" 
                gap={16}
                className={styles.formWrapper}
            >
                <form  
                    onSubmit={handleSubmit(onSubmit)} 
                    className={styles.mainContent}
                >
                    <Stack 
                        direction="column" 
                        justify="center" 
                        align="center" 
                        gap={16}
                    >
                        <img src={logo} alt={t("Logo")} className={styles.logo} />
                        
                    <Stack 
                        direction="row" 
                        justify="flex-end" 
                        fullWidth
                    >
                        <Typography
                            variant="h1" 
                            justify="flex-end"
                            className={styles.welcomeText}
                        >
                            {t("Welcome")}
                        </Typography>
                    </Stack>
                        {error?.status === 'FETCH_ERROR' && (
                            <Typography 
                                variant="body16" 
                                as="span"
                                className={styles.errorText}
                            >
                                {t("Server connection error")}
                            </Typography>
                        )}

                        {error?.status !== 'FETCH_ERROR' && error && (
                            <Typography 
                                variant="body16" 
                                as="span"
                                className={styles.errorText}
                            >
                                {t("Invalid username or password")}
                            </Typography>
                        )}

                        <Typography 
                            variant="body14" 
                        >
                            {t("Please log in to access your admin dashboard and manage the system effectively.")}
                        </Typography>

                        <Stack direction="column" gap="8" className={styles.fieldContainer}>
                            <Typography
                                variant="body14" 
                                as="label" 
                                htmlFor="username"
                            >
                                {t("Login")}
                            </Typography>
                            <Input
                                fullWidth
                                id="username"
                                type="text"
                                className={styles.input}
                                {...register("username", {
                                    required: t("Username is required"),
                                })}
                            />
                            {errors.username && (
                                <Typography
                                    variant="body12" 
                                    as="span"
                                    className={styles.errorText}
                                >
                                    {errors.username.message}
                                </Typography>
                            )}
                        </Stack>

                        <Stack direction="column" gap="8" className={styles.fieldContainer}>
                            <Typography
                                variant="body14" 
                                as="label"
                                htmlFor="password"
                            >
                                {t("Password")}
                            </Typography>
                            <Input
                                fullWidth
                                id="password"
                                type="password"
                                className={styles.input}
                                {...register("password", {
                                    required: t("Password is required"),
                                })}
                            />
                            {errors.password && (
                                <Typography
                                    variant="body12" 
                                    as="span"
                                    className={styles.errorText}
                                >
                                    {errors.password.message}
                                </Typography>
                            )}
                        </Stack>
                        
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={styles.submitButton}
                        >
                            {t("Sign in")}
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </Stack>
    );
};