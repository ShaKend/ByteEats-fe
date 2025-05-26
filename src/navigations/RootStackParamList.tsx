export type RootStackParamList = {
    Home: undefined;
    Sign: { loginAction: string };
    Verification: {
        email: string;
        username?: string;
        password: string;
    };
    ResetPassword: undefined;
};