import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { styles } from "@/styles/feed.styles";

export default function Index() {
  const { signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const posts = useQuery(api.posts.getFeedPosts);
  
  const followingUsers = useQuery(api.users.getFollowedUsers);

  if (!posts || !Array.isArray(posts) || followingUsers === undefined) {
    return <Loader />;
  }
  
  if (posts.length === 0) return <NoPostsFound />;

  const followedUserIds = followingUsers.map((user) => user._id);
  const followedPosts = posts.filter((post) =>
    post.author._id && followedUserIds.includes(post.author._id)
  );

  if (followedPosts.length === 0) return <NoPostsFound />;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <LinearGradient
      colors={COLORS.backgroundGradient}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>RaveSync</Text>
          <TouchableOpacity onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={followedPosts}
          renderItem={({ item }) => <Post post={item} />}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        />
      </View>
    </LinearGradient>
  );
}

const NoPostsFound = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
  </View>
);
