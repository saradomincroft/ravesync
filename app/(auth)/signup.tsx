import { useState, useEffect } from "react";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import React from "react";
import { useSignUp, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, Button, View, TouchableOpacity } from 'react-native'
import { Link, useRouter } from 'expo-router'

export default function SignUp() {
    const { startSSOFlow } = useSSO();
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignUp = async () => {
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
    const handleEmailPasswordSignUp = async () => {
        if (!isLoaded) return;
    
        try {
            const signUpAttempt = await signUp.create({
                emailAddress: email,
                password: password, 
            });
    
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
    
            setPendingVerification(true);
        } catch (err) {
            console.error('Sign-up failed:', JSON.stringify(err, null, 2));
            setError('Something went wrong during sign-up. Please try again.');
        }
    };
    

    const onVerifyPress = async () => {
        if (!isLoaded) return

        try {
        const signUpAttempt = await signUp.attemptEmailAddressVerification({
            code,
        })

        if (signUpAttempt.status === 'complete') {
            await setActive({ session: signUpAttempt.createdSessionId })
            router.replace('/(tabs)')
        } else {
            console.error(JSON.stringify(signUpAttempt, null, 2))
        }
        } catch (err) {
        console.error(JSON.stringify(err, null, 2))
        }
    }

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
            <Button title="Verify" onPress={onVerifyPress} />
        </>
        )
    }

    return (
        // <View>
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
  )
}