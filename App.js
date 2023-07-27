//https://www.youtube.com/watch?v=BDeKTPQzvR4&t=619s&ab_channel=CodewithBeto
import { Button, StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar/build/StatusBar";

WebBrowser.maybeCompleteAuthSession();
const TOKEN_KEY = "OAuth";

export default function App() {
  const [userInfo, setUserinfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
  });
console.log(process.env.EXPO_PUBLIC_IOS_CLIENT_ID)
  useEffect(() => {
    console.log("inside useEffect");
    handleSignInWithGoogle();
  }, [response]);

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(user));
      setUserinfo(user);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSignInWithGoogle = async () => {
    const user = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!user) {
      if (response?.type === "success") {
        await getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserinfo(JSON.parse(user));
    }
  };
  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(userInfo)}</Text>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar></StatusBar>
      <Button
        title="Sign in with Google"
        onPress={() => promptAsync()}
      ></Button>
      <Button
        title="Delete data"
        onPress={async () => {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
        }}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
