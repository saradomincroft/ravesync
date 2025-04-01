import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "@/components/InitialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { useCallback } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  })

  const onLayoutRootView = useCallback(async () => {
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);
  
  // 1024 square for splash - doesnt work in expo go
  // can configure more in app.json
  // for icon icons - newer adaptive icons use adaptive icon
  // change icon.png and adaptive-icon.png
  
  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: "black"}} onLayout={onLayoutRootView}>
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}