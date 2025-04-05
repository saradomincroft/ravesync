import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();


  return isSignedIn ? <Redirect href="/(tabs)/(home)" /> : <Redirect href="/(auth)/loginSignup" />;
}
