import { COLORS } from '@/constants/theme';
import { View, Text, FlatList } from 'react-native'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api';
import { Loader } from '@/components/Loader';
import { styles } from '@/styles/feed.styles';
import { Image } from 'expo-image';
import { ScrollView } from 'react-native-gesture-handler';

export default function Bookmarks() {
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts);

  if (bookmarkedPosts === undefined) return <Loader />;
  if (bookmarkedPosts.length === 0) return <NoBookmarksFound />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>

      {/* POSTS */}

      <FlatList
        data={bookmarkedPosts}
        keyExtractor={(item, index) => (item?._id ? item._id.toString() : index.toString())}
        numColumns={3}
        contentContainerStyle={{ padding: 8 }}
        renderItem={({ item }) => {
          if (!item) return null;
          return (
            <View key={item._id} style={{ width: "33.33%", padding: 1 }}>
              <Image
                source={item.imageUrl}
                style={{ width: "100%", aspectRatio: 1 }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            </View>
          );
        }}
      />
    </View>
  )
}

function NoBookmarksFound() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <Text style={{ color: COLORS.primary, fontSize: 22 }}>No bookmarked posts yet</Text>
    </View>
  )
}