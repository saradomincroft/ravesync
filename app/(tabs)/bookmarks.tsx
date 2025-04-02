import { COLORS } from '@/constants/theme';
import { View, Text } from 'react-native'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api';
import { Loader } from '@/components/Loader';

export default function Bookmarks() {
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts);

  if (bookmarkedPosts === undefined) return <Loader />;
  if (bookmarkedPosts.length === 0) return <NoBookmarksFound />;

  return (
    <View>
      <Text>bookmarks</Text>
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