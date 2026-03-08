import FilterHelpCard from "@/components/FilterHelper";
import MenuCard from "@/components/MenuCard";
import { Color } from "@/constants/color";
import useLanguageStore from "@/stores/useLanguage";
import useTab from "@/stores/useTab";
import { ReaderScreenProps } from "@/types";
import { SearchResult, searchSuttas } from "@/utils/offlineQueries";
import { hp } from "@/utils/responsive";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { Appbar, IconButton, Searchbar, Text } from "react-native-paper";

const Search = () => {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const searchRef = React.useRef<TextInput>(null);
  const { addItem } = useTab();

  const [showLanguage, setShowLanguage] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [selectedLanguages, setShowSelectedLanguages] = useState();

  const langCode = currentLanguage?.iso_code;

  const { data, isFetching, isLoading } = useQuery<SearchResult[]>({
    queryKey: ["search", searchQuery, langCode],
    queryFn: () => searchSuttas(searchQuery, langCode),
    enabled: searchQuery.trim().length > 0 && isSubmitting,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const [languages, setLanguages] = useState([
    [
      {
        uid: "af",
        name: "Afrikaans",
        iso_code: "af",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "id",
        name: "Bahasa Indonesia",
        iso_code: "id",
        is_root: false,
        localized: true,
        localized_percent: 13,
        checked: false,
      },
      {
        uid: "ca",
        name: "Català",
        iso_code: "ca",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "cs",
        name: "Čeština",
        iso_code: "cs",
        is_root: false,
        localized: true,
        localized_percent: 1,
        checked: false,
      },
      {
        uid: "lzh",
        name: "Literary Chinese",
        iso_code: "lzh",
        is_root: true,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "de",
        name: "Deutsch",
        iso_code: "de",
        is_root: false,
        localized: true,
        localized_percent: 75,
        checked: false,
      },
      {
        uid: "et",
        name: "Eesti keel",
        iso_code: "et",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "en",
        name: "English",
        iso_code: "en",
        is_root: false,
        localized: true,
        localized_percent: 100,
        checked: true,
      },
      {
        uid: "es",
        name: "Español",
        iso_code: "es",
        is_root: false,
        localized: true,
        localized_percent: 2,
        checked: false,
      },
      {
        uid: "fr",
        name: "Français",
        iso_code: "fr",
        is_root: false,
        localized: true,
        localized_percent: 33,
        checked: false,
      },
      {
        uid: "pgd",
        name: "Gāndhārī",
        iso_code: "pgd",
        is_root: true,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "hr",
        name: "Hrvatski",
        iso_code: "hr",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "haw",
        name: "ʻŌlelo Hawaiʻi",
        iso_code: "haw",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "it",
        name: "Italiano",
        iso_code: "it",
        is_root: false,
        localized: true,
        localized_percent: 11,
        checked: false,
      },
      {
        uid: "kho",
        name: "Khotanese",
        iso_code: "kho",
        is_root: true,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "la",
        name: "Latine",
        iso_code: "la",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "lt",
        name: "Lietuvių Kalba",
        iso_code: "lt",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "hu",
        name: "Magyar",
        iso_code: "hu",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "nl",
        name: "Nederlands",
        iso_code: "nl",
        is_root: false,
        localized: true,
        localized_percent: 3,
        checked: false,
      },
      {
        uid: "no",
        name: "Norsk",
        iso_code: "no",
        is_root: false,
        localized: true,
        localized_percent: 3,
        checked: false,
      },
      {
        uid: "pli",
        name: "Pāli",
        iso_code: "pli",
        is_root: true,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "pl",
        name: "Polski",
        iso_code: "pl",
        is_root: false,
        localized: true,
        localized_percent: 3,
        checked: false,
      },
      {
        uid: "pt",
        name: "Português",
        iso_code: "pt",
        is_root: false,
        localized: true,
        localized_percent: 96,
        checked: false,
      },
      {
        uid: "pra",
        name: "Prākrit",
        iso_code: "pra",
        is_root: true,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "ro",
        name: "Română",
        iso_code: "ro",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "sld",
        name: "Saarländisch",
        iso_code: "sld",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "san",
        name: "Sanskrit",
        iso_code: "san",
        is_root: true,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "sk",
        name: "Slovenčina",
        iso_code: "sk",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "sl",
        name: "Slovenščina",
        iso_code: "sl",
        is_root: false,
        localized: true,
        localized_percent: 1,
        checked: false,
      },
      {
        uid: "sr",
        name: "Srpski",
        iso_code: "sr",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "fi",
        name: "Suomi",
        iso_code: "fi",
        is_root: false,
        localized: true,
        localized_percent: 1,
        checked: false,
      },
      {
        uid: "sv",
        name: "Svenska",
        iso_code: "sv",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "xct",
        name: "Tibetan",
        iso_code: "xct",
        is_root: true,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "vi",
        name: "Tiếng Việt",
        iso_code: "vi",
        is_root: false,
        localized: true,
        localized_percent: 7,
        checked: false,
      },
      {
        uid: "xto",
        name: "Tocharian A",
        iso_code: "xto",
        is_root: true,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "tr",
        name: "Türkçe",
        iso_code: "tr",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "uig",
        name: "Uighur",
        iso_code: "uig",
        is_root: true,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "gsw",
        name: "Züridütsch",
        iso_code: "gsw",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "mn",
        name: "монгол хэл",
        iso_code: "mn",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "ru",
        name: "Русский",
        iso_code: "ru",
        is_root: false,
        localized: true,
        localized_percent: 29,
        checked: false,
      },
      {
        uid: "he",
        name: "עִבְֿרִיתּ",
        iso_code: "he",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "ur",
        name: "اُردُو",
        iso_code: "ur",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "ar",
        name: "اَلْعَرَبِيَّةُ",
        iso_code: "ar",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "fa",
        name: "فارسی",
        iso_code: "fa",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "mr",
        name: "मराठी",
        iso_code: "mr",
        is_root: false,
        localized: true,
        localized_percent: 1,
        checked: false,
      },
      {
        uid: "hi",
        name: "हिन्दी",
        iso_code: "hi",
        is_root: false,
        localized: true,
        localized_percent: 1,
        checked: false,
      },
      {
        uid: "bn",
        name: "বাংলা",
        iso_code: "bn",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "gu",
        name: "ગુજરાતી",
        iso_code: "gu",
        is_root: false,
        localized: true,
        localized_percent: 1,
        checked: false,
      },
      {
        uid: "ta",
        name: "தமிழ்",
        iso_code: "ta",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "kan",
        name: "ಕನ್ನಡ",
        iso_code: "kan",
        is_root: false,
        localized: true,
        localized_percent: 1,
        checked: false,
      },
      {
        uid: "si",
        name: "සිංහල",
        iso_code: "si",
        is_root: false,
        localized: true,
        localized_percent: 1,
        checked: false,
      },
      {
        uid: "th",
        name: "ไทย",
        iso_code: "th",
        is_root: false,
        localized: true,
        localized_percent: 1,
        checked: false,
      },
      {
        uid: "lo",
        name: "ລາວ",
        iso_code: "lo",
        is_root: false,
        localized: false,
        localized_percent: 0,
        checked: false,
      },
      {
        uid: "my",
        name: "မြန်မာဘာသာ",
        iso_code: "my",
        is_root: false,
        localized: true,
        localized_percent: 4,
        checked: false,
      },
      {
        uid: "ko",
        name: "한국어/조선말",
        iso_code: "ko",
        is_root: false,
        localized: true,
        localized_percent: 3,
        checked: false,
      },
      {
        uid: "jpn",
        name: "日本語",
        iso_code: "jpn",
        is_root: false,
        localized: true,
        localized_percent: 3,
        checked: false,
      },
      {
        uid: "zh",
        name: "汉语",
        iso_code: "zh",
        is_root: false,
        localized: true,
        localized_percent: 12,
        checked: false,
      },
    ],
  ]);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        statusBarHeight={Platform.OS === "ios" ? 5 : StatusBar.currentHeight}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={"Search"} />

        <IconButton icon={"web"} onPress={() => setShowLanguage(true)} />
        <IconButton
          icon={"filter-outline"}
          onPress={() => setShowFilter(true)}
        />
      </Appbar.Header>

      <View
        style={{
          paddingHorizontal: 10,
        }}
      >
        <Searchbar
          ref={searchRef}
          placeholder="Input search term"
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
              headerTitle={item.translated_title ?? item.title ?? undefined}
              translations={item.translations}
              headerSubtitle={item.title ?? undefined}
              description={item.blurb ?? undefined}
              rightText={item.acronym ?? undefined}
              leftText={item.root_lang || undefined}
              onAuthorPress={(translation) => {
                const tabItem: ReaderScreenProps = {
                  uid: item.uid,
                  author_uid: translation.author_uid,
                  lang: translation.lang,
                  author: translation.author,
                  author_short: translation.author_short,
                  segmented: translation.segmented,
                  title: item.translated_title || item.title || undefined,
                  translated_name: item.translated_title ?? undefined,
                  root_name: item.title ?? undefined,
                  blurb: item.blurb ?? undefined,
                };

                addItem(tabItem);

                router.push({
                  pathname: "/tabs/[uid]",
                  params: {
                    uid: item.uid,
                    author_uid: translation.author_uid,
                  },
                });
              }}
            />
          )}
        />
      )}

      {/* filter view */}
      <Modal
        visible={showFilter}
        onRequestClose={() => setShowFilter(false)}
        animationType="slide"
        backdropColor="rgba(0,0,0,0.5)"
      >
        <Appbar.Header
          style={{
            backgroundColor: Color.darkFixedBackgroundColor,
          }}
        >
          <Appbar.BackAction onPress={() => setShowFilter(false)} />
          <Appbar.Content title="Filter" />
        </Appbar.Header>
        <FilterHelpCard />
      </Modal>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  webview: {
    // flex: 1,
    backgroundColor: Color.primaryBackgroundColor,
    marginBottom: 20,
  },
});
