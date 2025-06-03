export type RootStackParamList = {
    Home: undefined;
    Sign: { loginAction: string };
    Verification: {
        email: string;
        password: string;
        username?: string;
        action: 'forgot' | 'change' | 'register';
    };
    ResetPassword: {
        action: 'reset' | 'change';
        email?: string;
    };
};