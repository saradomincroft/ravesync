import { useState, useEffect, useCallback } from "react";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSignUp, useSSO, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

export default function SignUp() {
    const { startSSOFlow } = useSSO();
    const router = useRouter();
    const { signUp, setActive, isLoaded } = useSignUp();
    const { user, isLoaded: isUserLoaded } = useUser(); // Using useUser to access current user
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');

    // Function to fetch the user profile using sessionId
    const getUserProfile = async (sessionId: string) => {
        const response = await fetch(`/api/getUserProfile`, {
            method: 'POST',
            body: JSON.stringify({ sessionId }),
        });
        const userProfile = await response.json();
        return userProfile;
    };

    // Effect to clear error message after 2 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleGoogleSignUp = async () => {
        try {
            const { createdSessionId } = await startSSOFlow({ strategy: "oauth_google" });

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });

                // Fetch the user profile after Google sign-in
                const userProfile = await getUserProfile(createdSessionId);
                if (userProfile && !userProfile.username) {
                    router.replace("/initialProfile");
                } else {
                    router.replace("/(tabs)");
                }
            } else {
                setError("Failed to create a session. Please try again.");
            }
        } catch (error) {
            setError("Something went wrong with Google sign-up. Please try again.");
        }
    };

    const handleEmailPasswordSignUp = useCallback(async () => {
        if (!isLoaded) return;

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const signUpAttempt = await signUp.create({
                emailAddress: email,
                password: password,
            });

            if (signUpAttempt.status === "complete") {
                await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
                setPendingVerification(true);
            } else {
                setError("Something went wrong during sign-up. Please try again.");
            }
        } catch (err: any) {
            if (err?.message) {
                setError(err.message);
            } else {
                setError("Something went wrong during sign-up. Please try again.");
            }
        }
    }, [isLoaded, email, password, confirmPassword]);

    const onVerifyPress = async () => {
        if (!isLoaded) return;

        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (signUpAttempt.status === "complete" && setActive && signUpAttempt.createdSessionId) {
                await setActive({ session: signUpAttempt.createdSessionId });

                // After email verification, check if the user has a username.
                if (!user?.username) {
                    router.replace("/initialProfile"); // Redirect to profile setup
                } else {
                    router.replace("/(tabs)"); // Redirect to main tabs
                }
            } else {
                setError("Verification failed. Please try again.");
            }
        } catch (err) {
            setError("Verification failed. Please try again.");
        }
    };

    if (pendingVerification) {
        return (
            <>
                <Text>Verify your email</Text>
                <TextInput
                    value={code}
                    placeholder="Enter your verification code"
                    placeholderTextColor="#666666"
                    onChangeText={(code) => setCode(code)}
                />
                <TouchableOpacity onPress={onVerifyPress}>
                    <Text>Verify</Text>
                </TouchableOpacity>
            </>
        );
    }

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
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={COLORS.grey}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TouchableOpacity
                style={styles.emailButton}
                onPress={handleEmailPasswordSignUp}
                activeOpacity={0.9}
            >
                <Text style={styles.emailButtonText}>Sign up with email</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignUp}
                activeOpacity={0.9}
            >
                <View style={styles.googleIconContainer}>
                    <Ionicons name="logo-google" size={20} color={COLORS.surface} />
                </View>
                <Text style={styles.googleButtonText}>Sign up with Google</Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}
