import CommonAppBar from "@/components/CommonAppBar";
import { Color } from "@/constants/color";
import { loadSuttaplex } from "@/utils/offlineQueries";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { Chip, Text } from "react-native-paper";

export default function SuttaScreen() {
  const { uid } = useLocalSearchParams<{ uid?: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["suttaplex", uid],
    queryFn: () => loadSuttaplex(uid as string),
    enabled: !!uid,
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Color.primaryColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{(error as Error).message || "Failed to load sutta"}</Text>
      </View>
    );
  }

  const title = data?.sutta?.translated_title || data?.sutta?.title || uid || "Sutta";

  return (
    <View style={{ flex: 1, backgroundColor: Color.primaryBackgroundColor }}>
      <CommonAppBar title={title} onBack={() => router.back()} onSearch={() => router.push("/search")} />

      <View style={{ flex: 1, padding: 12, backgroundColor: Color.primaryBackgroundColor }}>
        {data?.sutta?.blurb ? (
          <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
            {data.sutta.blurb}
          </Text>
        ) : null}

        <Text variant="titleMedium" style={{ marginBottom: 8 }}>Translations</Text>
        <FlatList
          data={data?.translations || []}
          keyExtractor={(t) => t.id ?? `${t.author_uid}-${t.lang}`}
          renderItem={({ item: t }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/suttaRead/[uid]",
                  params: {
                    uid: String(uid),
                    author_uid: t.author_uid,
                    lang: t.lang,
                    author: t.author,
                    author_short: t.author_short,
                  },
                })
              }
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: "#3333",
              }}
            >
              <Text style={{ fontWeight: "600" }}>{t.author} ({t.lang})</Text>
              {t.is_root ? (
                <Chip compact style={{ marginTop: 4, width: 72 }}>Pali</Chip>
              ) : null}
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}
