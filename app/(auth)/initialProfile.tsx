// import React, { useState } from "react";
// import { Text, TextInput, View, TouchableOpacity } from "react-native";
// import { useRouter } from "expo-router";
// import { useUser } from "@clerk/clerk-expo";
// import { createUser } from "@/convex/users";
// import { styles } from "@/styles/auth.styles";

// export default function InitialProfile() {
//   const router = useRouter();
//   const { user: currentUser } = useUser();
//   const [username, setUsername] = useState("");
//   const [bio, setBio] = useState("");
//   const [image, setImage] = useState("");
//   const [genres, setGenres] = useState<string[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const genreOptions = ["Rock", "Pop", "Jazz", "Hip-Hop", "Classical", "Electronic"];

//   const handleGenreSelect = (genre: string) => {
//     setGenres((prevGenres) => {
//       if (prevGenres.includes(genre)) {
//         return prevGenres.filter((g) => g !== genre);
//       } else {
//         return [...prevGenres, genre];
//       }
//     });
//   };

//   const handleProfileCompletion = async () => {
//     try {
//       if (!username) {
//         setError("Please enter a username.");
//         return;
//       }
//       if (!currentUser) {
//         setError("User not authenticated. Please log in.");
//         return;
//       }

//       const createUserResponse = await createUser({
//         username,
//         email: currentUser.email,
//         bio,
//         image,
//         followers: 0,
//         following: 0,
//         posts: 0,
//         followedGenres: genres,
//         clerkId: currentUser.id,
//       });

//       if (createUserResponse) {
//         router.replace("/(tabs)");
//       } else {
//         setError("Failed to update profile. Please try again.");
//       }
//     } catch (err) {
//       setError("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Complete Your Profile</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Bio (Optional)"
//         value={bio}
//         onChangeText={setBio}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Profile Image URL (Optional)"
//         value={image}
//         onChangeText={setImage}
//       />
//       <Text style={styles.label}>Select Followed Genres (Optional)</Text>
//       <View style={styles.genresContainer}>
//         {genreOptions.map((genre) => (
//           <TouchableOpacity
//             key={genre}
//             onPress={() => handleGenreSelect(genre)}
//             style={[
//               styles.genreButton,
//               genres.includes(genre) && styles.selectedGenre,
//             ]}
//           >
//             <Text style={styles.genreText}>{genre}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//       {error && <Text style={styles.errorText}>{error}</Text>}

//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleProfileCompletion}
//         activeOpacity={0.8}
//       >
//         <Text style={styles.buttonText}>Complete Profile</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
