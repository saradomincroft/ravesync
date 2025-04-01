# ScrollView vs FlatList

## FlatList:
- Performance critical: Only renders items currently visible on screen - saves memory and improves performance.
- Long lists of data: When rendering potentially large sets of data (feeds, search results, message lists).
- Unkwon content length: When you don't know in advance.
- Same kind of content: When displaying many items with same structure

## ScrolLView:
- All content fits in memory: Displaying small, fixed amount of content that won't cause performance issues.
- Static content: Screens with predetermined, limited content (forms, profile pages, detail views).
- Mixed content types: Different UI components in a specific layout doesn't follow list pattern.
- Horizontal carousel: Small horizontal scrolling components like image carousels with limited items.

# Pressable vs TouchableOpacity

## Pressable:
- More customisation needed: Different states (pressed, hovered, focused).
- Complex interaction states: Handle multiple interaction states with fine-grained control.
- Future-proofing: Newer and designed to eventually replace Touchable.
- Platform specific: Customise behaviour across different platforms.
- Nested press handlers: Need to handle interactive elements.

## TouchableOpacity:
- Simple fade effect: Need a simple opacity change on press.
- Backwards compatible: Working with older codebases that use it.
- Simpler API: Prefer a straight forward API with fewer configurations.
- Specific opacity animations: When need precise control over opacity value on press.
- Legacy support: For maintaining consistency with existing components.

# Expo Image vs React Native Image

## Expo Image:
- Performance: Expo Image uses native image libraries offer better performance.
- Caching: Built-in caching system more robust and configurable.
- Modern image capabilities: Need for advance features like content-aware resizing, blurhash placeholders, progressive loading.
- Transitions: Smooth transitions between image loading states.
- Cross-platform: More consistent behaviour across iOS and Android.
- Adaptivity: Better support for adaptive images based on screen size and resolution.

## React Native Image:
- Simplicity: Basic image display minimal configuration.
- Bundle size: Trying to keep app's bundle size smaller.
- No Expo dependency: Not using Expo or want to minimze dependencies.
- Legacy support: Maintaining compatibility with existing code that uses React Native Image.
- Basic requirements: Advanced image features aren't needed.

# icon.png vs adaptive-icon.pnh

## icon.png
- Standard appears on most devices. Primary icon for app.
- Recommended size: 1024x1024.

## adaptive-icon.png:
- Introduced Android 8.0 (Oreo), specific to Android devices.
- Recommended size: 1024x1024

# Resources
- https://reactnative.directory/
- https://docs.swmansion.com/react-native-reanimated/
