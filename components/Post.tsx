import { COLORS } from '@/constants/theme';
import {styles } from '@/styles/feed.styles';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

// ad post type later
export default function Post({post}:{post:any}) {

  return (
    <View style={styles.post}>
        {/* POST HEADER */}
        <View style={styles.postHeader}>
            <Link href={"/(tabs)/notifications"}>
                <TouchableOpacity style={styles.postHeaderLeft}>
                    <Image
                        source={post.author.image}
                        style={styles.postAvatar}
                        contentFit="cover"
                        transition={200}
                        cachePolicy="memory-disk"
                    />
                    <Text style={styles.postUsername}>{post.author.username}</Text>
                </TouchableOpacity>
            </Link>

            {/* Show delete button todo: fix later */}
            {/* <TouchableOpacity>
               <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white} /> 
            </TouchableOpacity> */}
            <TouchableOpacity
            >
               <Ionicons name="trash-outline" size={20} color={COLORS.primary} /> 
            </TouchableOpacity>
        </View>
        
        {/* IMAGE */}
        <Image
            source={post.imageUrl}
            style={styles.postImage}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
        />
    </View>
  )
}