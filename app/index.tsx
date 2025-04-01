import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();


  return isSignedIn ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/loginSignup" />;
}
