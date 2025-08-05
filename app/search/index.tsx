import instance from "@/api/instance";
import MenuCard from "@/components/MenuCard";
import { Color } from "@/constants/color";
import useLanguageStore from "@/stores/useLanguage";
import { Suttaplex } from "@/types/suttaplex";
import { hp } from "@/utils/responsive";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Appbar, Searchbar, Text } from "react-native-paper";

const fetchSearchResults = async (query: string, language: string) => {
  const { data } = await instance.get("/search/instant", {
    params: {
      query,
      language,
    },
  });

  return data?.suttaplex;
};

const Search = () => {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const searchRef = React.useRef<TextInput>(null);

  const { data, isFetching, isLoading } = useQuery<Suttaplex[]>({
    queryKey: ["search", searchQuery, currentLanguage],
    queryFn: () => fetchSearchResults(searchQuery, currentLanguage?.iso_code!),
    enabled: searchQuery.length > 0 && isSubmitting,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        statusBarHeight={Platform.OS === "ios" ? 5 : StatusBar.currentHeight}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        {/* <Appbar.Content title={"Search"} /> */}
      </Appbar.Header>

      <View
        style={{
          paddingHorizontal: 10,
        }}
      >
        <Searchbar
          ref={searchRef}
          placeholder="Search by sutta name or code..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onFocus={() => setIsSubmitting(false)}
          onSubmitEditing={(e) => {
            setIsSubmitting(true);
          }}
          // onClearIconPress={() => {
          //   setSearchQuery("");
          //   setIsSubmitting(false);
          //   searchRef.current?.focus();
          // }}
          autoFocus
        />
      </View>

      {!data && !isLoading && (
        <View
          style={{
            marginTop: hp(32),
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text variant="bodyMedium">
            Your search results will appear here.
          </Text>
        </View>
      )}

      {isFetching ? (
        <View
          style={{
            marginTop: hp(32),
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={Color.primaryColor} />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.uid}
          ListEmptyComponent={
            <View
              style={{
                alignItems: "center",
                marginTop: hp(32),
              }}
            >
              {!isLoading && data?.length === 0 && (
                <Text variant="bodyMedium">
                  No results found for{" "}
                  <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
                    {searchQuery}
                  </Text>
                </Text>
              )}
            </View>
          }
          style={{
            paddingHorizontal: 10,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 10,
          }}
          renderItem={({ item }) => (
            <MenuCard
              uid={item.uid}
              headerTitle={item.translated_title}
              translations={item.translations}
              headerSubtitle={item.original_title}
              description={item.blurb}
              rightText={item.acronym}
              leftText={item.root_lang}
              onAuthorPress={(translation) => {
                router.navigate({
                  pathname: "/suttaRead/[id]",
                  params: {
                    ...item,
                    extraData: JSON.stringify(item),
                    ...translation,
                  },
                });
              }}
            />
          )}
        />
      )}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});
