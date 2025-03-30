import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from "@/styles/auth.styles";
import { COLORS } from "@/constants/theme";
import Login from "./login";
import SignUp from "./signup";

export default function LoginSignup() {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <View style={styles.container}>
            {/* BRAND SECTION */}
            <View style={styles.brandSection}>
                <View style={styles.logoContainer}>
                    <Text style={styles.appName}>RaveSync</Text>
                    <Text style={styles.tagLine}>Connect with music lovers</Text>
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

            {/* TAB SECTION */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        !isSignUp && styles.activeTab,
                    ]}
                    onPress={() => setIsSignUp(false)}
                >
                    <Text
                        style={[
                            styles.tabText,
                            !isSignUp && styles.activeTabText,
                        ]}
                    >
                        Login
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        isSignUp && styles.activeTab,
                    ]}
                    onPress={() => setIsSignUp(true)}
                >
                    <Text
                        style={[
                            styles.tabText,
                            isSignUp && styles.activeTabText,
                        ]}
                    >
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
            {isSignUp ? <SignUp /> : <Login />}
        </View>
    );
}
