import { STORIES } from "@/constants/mock-data";
import { styles } from "@/styles/feed.styles";
import { FlatList } from "react-native";
import Story from "./Story";

{/* STORIES */}
const StoriesSection = () => {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.storiesContainer}
      data={STORIES}
      renderItem={({ item }) => <Story key={item.id} story={item} />} 
      keyExtractor={(item) => item.id.toString()}
    />
  )
};

export default StoriesSection;