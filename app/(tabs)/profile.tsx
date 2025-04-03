import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { View, Text } from "react-native";

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

  const handleSaveProfile = async () => {}

  if (!currentUser || posts === undefined) return 

  return (
    <View style={styles.container}>
        <Text>Profile screen</Text>
    </View>
  )
}
