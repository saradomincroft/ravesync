import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
    Login: undefined;
    Home: undefined;
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { isSignedIn, isLoaded } = useUser();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            navigation.reset({
                index: 0,
                routes: [{ name: "Login" as keyof RootStackParamList }], // TypeScript fix
            });
        }
    }, [isLoaded, isSignedIn, navigation]);

    if (!isLoaded) return null;
    if (!isSignedIn) return null;

    return <>{children}</>;
}
