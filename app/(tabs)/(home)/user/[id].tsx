// [] because dynami
import { View, Text, TouchableOpacity, Pressable, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Id } from '@/convex/_generated/dataModel'
import { Loader } from '@/components/Loader'
import { styles } from '@/styles/profile.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'
import { ScrollView } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'

export default function UserProfileScreen() {
    const {id} = useLocalSearchParams()
    const router = useRouter();
    const profile = useQuery(api.users.getUserProfile, {id: id as Id<"users">})
    const posts = useQuery(api.posts.getPostsByUser, {userId: id as Id<"users">})
    const isFollowing = useQuery(api.users.isFollowing, {followingId: id as Id<"users">})
    const toggleFollow = useMutation(api.users.toggleFollow)
    const sortedPosts = posts?.slice().sort((a, b) => b._creationTime - a._creationTime);

    const handleBack = () => {
        if(router.canGoBack()) router.back();
    };

    if (profile === undefined || posts === undefined || isFollowing ===undefined) return <Loader />

  return (
        <LinearGradient
          colors={COLORS.backgroundGradient}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.container}
        >   
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.white}/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{profile.username}</Text>
                <View style={{width: 24}} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileInfo}>
                    <View style={styles.avatarAndStats}>
                        <Image
                        source={profile.image}
                        style={styles.avatar}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        />
                        {/* STATS */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.posts}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.followers}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.following}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.name}>{profile.username}</Text>
                    {profile?.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

                    <Pressable
                        style={[styles.followButton, isFollowing && styles.followingButton]}
                        onPress={() => toggleFollow({ followingId: id as Id<"users">})}
                    >
                        <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                            {isFollowing ? "Following" : "Follow"}
                        </Text>
                    </Pressable>

                    <View style={styles.postsGrid}>
                        {posts.length === 0 ? (
                            <View style={styles.noPostsContainer}>
                                <Ionicons name="images-outline" size={48} color={COLORS.grey} />
                                <Text style={styles.noPostsText}>No posts yet</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={sortedPosts}
                                numColumns={3}
                                scrollEnabled={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.gridItem}>
                                        <Image
                                            source={item.imageUrl}
                                            style={styles.gridImage}
                                            contentFit="cover"
                                            transition={200}
                                            cachePolicy="memory-disk"
                                        />
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item._id}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    </LinearGradient>

  )
}