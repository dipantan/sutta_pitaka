import React, { useRef, useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const ExpandableText = ({ description, color }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentHeight = useRef(0);
  const collapsedHeight = 20; // adjust for 1 line height if needed

  const animatedHeight = useSharedValue(collapsedHeight);

  const toggleExpand = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      animatedHeight.value = withTiming(
        next ? contentHeight.current : collapsedHeight,
        {
          duration: 300,
        }
      );
      return next;
    });
  };

  const onLayoutContent = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    contentHeight.current = height;
    // Set initial height if first render
    if (animatedHeight.value === collapsedHeight && isExpanded) {
      animatedHeight.value = height;
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    overflow: "hidden",
  }));

  return (
    <TouchableWithoutFeedback onPress={toggleExpand}>
      <Animated.View style={animatedStyle}>
        <Text
          onLayout={onLayoutContent}
          style={[styles.text, { color }]}
          numberOfLines={undefined} // show full content
        >
          {description}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default ExpandableText;
