// styles/create.styles.ts
import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  contentDisabled: {
    opacity: 0.7,
  },
  shareButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  shareTextDisabled: {
    color: COLORS.grey,
  },
  emptyImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyImageText: {
    color: COLORS.grey,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageSection: {
    width: width,
    height: width,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  changeImageButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    gap: 6,
  },
  changeImageText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "500",
  },
  inputSection: {
    padding: 16,
    flex: 1,
  },
  captionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  captionInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    paddingTop: 8,
    minHeight: 40,
  },
  inputLabel: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tag: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 14,
  },
  locationTag: {
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  
  closeModal: {
    marginTop: 16,
    textAlign: "center",
    color: "#FF5C5C",
    fontWeight: "600",
  },
  
  dropdownButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  
  dropdownText: {
    color: "#333",
    fontSize: 16,
  },  
});