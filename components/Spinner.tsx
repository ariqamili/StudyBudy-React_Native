import { ActivityIndicator, StyleSheet, View } from "react-native";

export function Spinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6B21A8" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
