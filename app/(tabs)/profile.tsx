import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Keyboard, KeyboardAvoidingView, Platform, TextInput, TouchableWithoutFeedback  } from "react-native";
import { FlatList, ScrollView } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  const { signOut, userId } = useAuth();
  const [isEditModalVisible, setIsEditedModalVisible] = useState(false);
  const currentUser = useQuery(api.users.getUserByClerkId, userId ? {clerkId: userId } : "skip" );
  
  const [editedProfile, setEditedProfile] = useState({
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
  });

  const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null);
  const posts = useQuery(api.posts.getPostsByUser, {});

  const updateProfile = useMutation(api.users.updateProfile);

  const handleSaveProfile = async () => {
    const trimmedUsername = editedProfile.username.trim();

    if (trimmedUsername.length === 0 || trimmedUsername.length > 16 || /\s/.test(trimmedUsername)) {
      alert("Username must be between 1 and 16 characters");
      return;
    }
      try {
        await updateProfile(editedProfile);
        setIsEditedModalVisible(false);
      }catch (error) {
        // Handle any errors from the mutation
        alert('Error updating profile. Please try again.');
    }
  }

  if (!currentUser || posts === undefined) return <Loader/>

  return (
    <LinearGradient
      colors={COLORS.backgroundGradient}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}
    >   
    <View style={styles.container}>
      {/*HEADER */}
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.username}>{currentUser.username}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerIcon} onPress={() => signOut()}>
                <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileInfo}>
            {/* AVATAR & STATS */}
            <View style={styles.avatarAndStats}>
              <View style={styles.avatarContainer}>
                <Image
                  source={currentUser.image}
                  style={styles.avatar}
                  contentFit="cover"
                  transition={200}
                />
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{currentUser.posts}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{currentUser.followers}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{currentUser.following}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>
            </View>
            <Text style={styles.name}>{currentUser.username}</Text>
            {currentUser?.bio ? (
              <Text style={styles.bio}>{currentUser.bio}</Text>
            ) : null}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditedModalVisible(true)}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="share-outline" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
          {posts.length === 0 && <NoPostsFound /> }

          <FlatList
            data={posts}
            numColumns={3}
            scrollEnabled={false}
            renderItem={ ({item}) => (
              <TouchableOpacity style={styles.gridItem} onPress={() => setSelectedPost(item)}>
                <Image
                  source={item.imageUrl}
                  style={styles.gridImage}
                  contentFit="cover"
                  transition={200}
                />
              </TouchableOpacity>
            )}
          />
        </ScrollView>

        {/* EDIT PROFILE MODAL */}
        <Modal
          visible={isEditModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsEditedModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContainer}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Profile</Text>
                  <TouchableOpacity onPress={() => setIsEditedModalVisible(false)}>
                    <Ionicons name="close" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Username</Text>
                  <TextInput
                    style={styles.input}
                    value={editedProfile.username}
                    onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, username: text }))}
                    placeholderTextColor={COLORS.grey}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Bio</Text>
                  <TextInput
                    style={[styles.input, styles.bioInput]}
                    value={editedProfile.bio}
                    onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, bio: text}))}
                    multiline
                    numberOfLines={4}
                    placeholderTextColor={COLORS.grey}
                    autoComplete="off"
                  />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>
        
        {/* SELECTED IMAGE MODAL */}
        <Modal
          visible={!!selectedPost} // !! convert object into boolean
          animationType="fade"
          transparent={true}
          onRequestClose={() => setSelectedPost(null)}
        >
          <View style={styles.modalBackdrop}>
            {selectedPost && (
              <View style={styles.postDetailContainer}>
                <View style={styles.postDetailHeader}>
                  <TouchableOpacity onPress={() => setSelectedPost(null)}>
                    <Ionicons name="close" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <Image
                  source={selectedPost.imageUrl}
                  cachePolicy={"memory-disk"}
                  style={styles.postDetailImage}
                />
              </View>
            )}
          </View>
        </Modal>
        </View>
      </View>
    </LinearGradient>
  )
}

function NoPostsFound() {
  return (
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name="images-outline" size={48} color={COLORS.primary} />
      <Text style={{ fontSize: 20, color: COLORS.white }}>No posts yet</Text>
    </View>
  )
}