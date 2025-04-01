import { useState, useEffect, useCallback } from "react";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSSO, useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

export default function Login() {
    const { startSSOFlow } = useSSO();
    const router = useRouter();
    const { signIn, setActive, isLoaded } = useSignIn();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleGoogleSignIn = async () => {
        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy: "oauth_google" });
            if (setActive && createdSessionId) {
                setActive({ session: createdSessionId });
                router.replace("/(tabs)");
            }
        } catch (error) {
            setError("Something went wrong with Google login. Please try again.");
        }
    };

    const handleEmailPasswordSignIn = useCallback(async () => {
        if (!isLoaded) return;

        try {
            const signInAttempt = await signIn.create({
                identifier: email,
                password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace('/(tabs)');
            } else {
                setError("Incorrect email or password.");
            }
        } catch (err) {
            setError("Incorrect details, please try again.");
        }
    }, [isLoaded, email, password]);

    return (
        <View style={styles.loginSection}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.grey}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={COLORS.grey}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity
                style={styles.emailButton}
                onPress={handleEmailPasswordSignIn}
                activeOpacity={0.9}
            >
                <Text style={styles.emailButtonText}>Sign in with email</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                activeOpacity={0.9}
            >
                <View style={styles.googleIconContainer}>
                    <Ionicons name="logo-google" size={20} color={COLORS.surface} />
                </View>
                <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}

        </View>
    );
}
