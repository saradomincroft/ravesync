// styles/auth.styles.ts
import { COLORS } from "@/constants/theme";
import { Platform, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: COLORS.background,
  },
  brandSection: {
    alignItems: "center",
    marginTop: height * 0.04,
  },
  logoContainer: {
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: 42,
    fontWeight: "700",
    fontFamily: "JetBrainsMono-Medium",
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  tagLine: {
    fontSize: 16,
    color: COLORS.grey,
    letterSpacing: 1,
  },
  illustrationContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  illustration: {
    width: width * 0.75,
    height: width * 0.75,
    maxHeight: 240,
  },
  loginSection: {
    width: "100%",
    paddingHorizontal: 24,
    alignItems: "center",
  },
  signupText: {
    paddingTop: 16,
    maxWidth: 300,
    fontSize: 16,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  input: {
    width: "100%",
    maxWidth: 300,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.grey,
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  emailButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 16,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  emailButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  errorText: {
    fontSize: 14,
    color: "red",
    textAlign: "center",
    marginTop: 8,
    maxWidth: 300,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: "100%",
    maxWidth: 300,
    ...Platform.select({
      ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
      },
      android: {
          elevation: 5,
      },
    }),
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.surface,
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.grey,
    maxWidth: 280,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
},
tabButton: {
    padding: 10,
    margin: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
},
activeTab: {
    borderBottomColor: COLORS.primary,
},
tabText: {
    fontSize: 16,
    color: COLORS.grey,
},
activeTabText: {
    color: COLORS.primary,
},
genresContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginVertical: 10,
},
genreButton: {
  padding: 10,
  margin: 5,
  backgroundColor: COLORS.grey,
  borderRadius: 5,
},
selectedGenre: {
  backgroundColor: COLORS.primary,
},
genreText: {
  color: COLORS.primary,
},
label: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 5,
},
});