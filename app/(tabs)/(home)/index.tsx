import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { styles } from "@/styles/feed.styles";
import DropDownPicker from 'react-native-dropdown-picker';

export default function Index() {
  const { signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // State for dropdowns
  const [genreOpen, setGenreOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Fetch genres and cities from Convex
  const genres = useQuery(api.genres.getGenres);
  const cities = useQuery(api.locations.getLocations, {});

  // Fetch posts
  const posts = useQuery(api.posts.getFeedPosts);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // Filter posts based on selected genre and city
  const filteredPosts = posts?.filter((post) => {
    const genreMatch = selectedGenre ? post.genre === selectedGenre : true;
    const cityMatch = selectedCity ? post.location === selectedCity : true;
    return genreMatch && cityMatch;
  });

  if (!posts || !Array.isArray(posts)) return <Loader />;

  return (
    <LinearGradient
      colors={COLORS.backgroundGradient}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>RaveSync</Text>
          <TouchableOpacity onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          {/* Genre Dropdown */}
          {genres && genres.length > 0 ? (
            <DropDownPicker
              open={genreOpen}
              value={selectedGenre}
              items={genres?.map((genre) => ({ label: genre.name, value: genre._id })) || []}
              setOpen={setGenreOpen}
              setValue={setSelectedGenre}
              placeholder="Select Genre"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          ) : (
            <Text style={styles.noOptionsText}>No genres available</Text>
          )}

          {/* City Dropdown */}
          {cities && cities.length > 0 ? (
            <DropDownPicker
              open={cityOpen}
              value={selectedCity}
              items={cities?.map((city) => ({ label: city.name, value: city._id })) || []}
              setOpen={setCityOpen}
              setValue={setSelectedCity}
              placeholder="Select City"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          ) : (
            <Text style={styles.noOptionsText}>No cities available</Text>
          )}

          {/* Clear Filters */}
          <TouchableOpacity onPress={() => {
            setSelectedGenre(null);
            setSelectedCity(null);
          }}>
            <Text style={styles.clearFilterText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Posts or No Posts Found */}
        {(filteredPosts ?? []).length > 0 ? (
          <FlatList
            data={filteredPosts}
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
        ) : (
          <View style={styles.noPostsContainer}>
            <Text style={styles.noPostsText}>No posts found</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}
