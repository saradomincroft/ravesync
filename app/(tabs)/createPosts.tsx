import { useUser } from "@clerk/clerk-expo"
import { useRouter } from "expo-router"
import { View, Text } from 'react-native'
import { useState } from "react";

export default function CreatePosts() {

  const router = useRouter();
  const { user } = useUser();
  
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [genre, setGenre] = useState("");
  const [isSharing, setIsSharing] = useState(false);


  return (
    <View>
      <Text>create</Text>
    </View>
  )
}