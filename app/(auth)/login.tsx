import { useState } from "react";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles"
import { useSSO, useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import React from "react";

export default function login() {
    const {startSSOFlow} = useSSO()
    const router = useRouter();

    const { signIn, setActive, isLoaded } = useSignIn()  
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        try {
            const {createdSessionId,setActive}=await startSSOFlow({strategy:"oauth_google"})
            if(setActive && createdSessionId){
                setActive({session:createdSessionId})
                router.replace("/(tabs)")
            }
        } catch (error) {
            console.error("OAuth error:", error);
        }
    };

    const handleEmailPasswordSignIn = React.useCallback(async () => {
        if (!isLoaded) return
    
        try {
          const signInAttempt = await signIn.create({
            identifier: email,
            password,
          })
    
          if (signInAttempt.status === 'complete') {
            await setActive({ session: signInAttempt.createdSessionId })
            router.replace('/')
          } else {
            console.error(JSON.stringify(signInAttempt, null, 2))
          }
        } catch (err) {
          console.error(JSON.stringify(err, null, 2))
        }
      }, [isLoaded, email, password])
    
    return (
        <View style={styles.container}>
            {/* BRAND SECTION */}
            <View style={styles.brandSection}>
                <View style={styles.logoContainer}>
                    <Ionicons name="leaf" size={32} color={COLORS.primary} />
                    <Text style={styles.appName}>RaveSync</Text>
                    <Text style={styles.tagLine}>don't miss anything</Text>
                </View>
            </View>
            {/* ILLUSTRATION */}
            <View style={styles.illustrationContainer}>
            <Image
                source={require("../../assets/images/rave-ghost.png")}
                style={styles.illustration}
                resizeMode="contain"
            />
            </View>

            {/* LOGIN SECTION */}
            <View style={styles.loginSection}>
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
                <Text style={styles.termsText}>
                    By continuing, you agree to our Terms and Privacy Policy
                </Text>
            </View>

        </View>
    );
}