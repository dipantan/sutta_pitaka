/* eslint-disable react-hooks/exhaustive-deps */
import CommonAppBar from "@/components/CommonAppBar";
import MenuCard from "@/components/MenuCard";
import { Color } from "@/constants/color";
import useLanguageStore from "@/stores/useLanguage";
import useTab from "@/stores/useTab";
import Styles from "@/styles";
import { loadLanguages, loadMenuByPitaka, loadMenuChildrenDetails, MenuChildDetail } from "@/utils/offlineQueries";
import { Entypo } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useMemo } from "react";
import {
  FlatList,
  LogBox,
  Pressable,
  TouchableOpacity,
  View
} from "react-native";
import { ActivityIndicator, Menu, Text } from "react-native-paper";

LogBox.ignoreAllLogs();

export default function Index() {
  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation();
  const { pitaka = "sutta" } = useLocalSearchParams<{ pitaka?: string }>();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const setLanguages = useLanguageStore((state) => state.setLanguages);
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const setCurrentLanguage = useLanguageStore((state) => state.setCurrentLanguage);
  const languages = useLanguageStore((state) => state.languages);

  const { data: languagesData, isLoading: languagesLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: loadLanguages,
  });

  useEffect(() => {
    if (languagesData && languagesData.length) {
      const supported = languagesData.filter((lang) =>
        ["en", "pli"].includes(lang.iso_code)
      );

      const resolvedLanguages = supported.length ? supported : languagesData;
      setLanguages(resolvedLanguages);

      if (!currentLanguage) {
        const defaultLang =
          resolvedLanguages.find((lang) => lang.iso_code === "en") ||
          resolvedLanguages[0];
        if (defaultLang) {
          setCurrentLanguage(defaultLang);
        }
      }
    }
  }, [currentLanguage, languagesData, setCurrentLanguage, setLanguages]);

  const { data: menuRoot, isLoading: rootLoading, error: menuError } = useQuery({
    queryKey: ["menu-root", pitaka],
    queryFn: () => loadMenuByPitaka(pitaka as string),
    enabled: !!pitaka,
  });

  const {
    data: menuChildren,
    isLoading: childrenLoading,
  } = useQuery<MenuChildDetail[]>({
    queryKey: ["menu-children", menuRoot?.uid],
    queryFn: () => loadMenuChildrenDetails(menuRoot?.uid as string),
    enabled: !!menuRoot?.uid,
  });

  const { items } = useTab();

  useEffect(() => {
    if (!currentLanguage && languages.length) {
      setCurrentLanguage(languages[0]);
    }
  }, [currentLanguage, languages, setCurrentLanguage]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: null,
    });
  }, [navigation]);

  const isLoading = languagesLoading || rootLoading || childrenLoading;

  const displayChildren = useMemo(() => menuChildren ?? [], [menuChildren]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={Color.primaryColor} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.primaryBackgroundColor,
      }}
    >
      {/* header */}
      <CommonAppBar
        title={menuRoot?.root_name || pitaka.toString()}
        onBack={() => router.back()}
        onSearch={() => router.push("/search")}
        rightContent={
          <>
            {items.length > 0 && (
              <Pressable
                style={Styles.tabButton}
                onPress={() => {
                  router.push({
                    pathname: "/tabs/[uid]",
                    params: {
                      uid: items[0]?.uid,
                      show: "true",
                    },
                  });
                }}
              >
                <Text style={{ color: Color.invertedTextColor }}>
                  {items.length}
                </Text>
              </Pressable>
            )}
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity onPress={openMenu} style={{ paddingRight: 8 }}>
                  <Entypo name="dots-three-vertical" size={24} color={Color.onPrimaryPrimaryTextColor} />
                </TouchableOpacity>
              }
              style={{ backgroundColor: Color.primaryBackgroundColor }}
              anchorPosition="top"
              mode="elevated"
              contentStyle={{ width: 200, padding: 0 }}
              elevation={5}
              keyboardShouldPersistTaps="handled"
              theme={{ roundness: 8 }}
            >
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  router.push("/about");
                }}
                titleStyle={{ fontWeight: "600" }}
                title="About"
              />
            </Menu>
          </>
        }
      />

      {/* content */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
          backgroundColor: Color.primaryBackgroundColor,
        }}
      >
        <FlatList
          data={displayChildren}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.uid}
          ListHeaderComponent={
            <View
              style={{
                marginBottom: 20,
                paddingHorizontal: 8,
                gap: 4,
              }}
            >
              <Text variant="titleMedium" style={{}}>
                {menuRoot?.blurb}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <MenuCard
              description={item.blurb ?? undefined}
              headerTitle={item.translated_name || item.root_name || undefined}
              isExpanded={false}
              leftText={item.root_name ?? undefined}
              uid={item.uid}
              yellowBrickRoad={item.yellow_brick_road ? true : undefined}
              yellowBrickRoadCount={item.yellow_brick_road_count ?? undefined}
              onPress={() => {
                router.push({
                  pathname: "/vaggaList/[uid]",
                  params: {
                    uid: item.uid,
                    title: item.root_name,
                  },
                });
              }}
            />
          )}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: Color.onPrimaryPrimaryTextColor }}>
                {menuError?.message || "No menu available"}
              </Text>
            </View>
          }
          contentContainerStyle={
            {
              // paddingVertical: 10,
            }
          }
        />
      </View>

    </View>
  );
}
