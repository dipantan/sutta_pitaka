/* eslint-disable react-hooks/exhaustive-deps */
import MenuCard from "@/components/MenuCard";
import { Color } from "@/constants/color";
import useLanguageStore from "@/stores/useLanguage";
import useTab from "@/stores/useTab";
import Styles from "@/styles";
import { loadLanguages, loadMenuByPitaka, loadMenuChildrenDetails, MenuChildDetail } from "@/utils/offlineQueries";
import { margin, padding, spacing, wp } from "@/utils/responsive";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
    FlatList,
    LogBox,
    Platform,
    Pressable,
    StatusBar,
    TouchableOpacity,
    View,
} from "react-native";
import {
    ActivityIndicator,
    Appbar,
    Button,
    Dialog,
    List,
    Menu,
    Text,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

LogBox.ignoreAllLogs();

export default function Index() {
  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation();
  const [showLanguageChooserDialog, setShowLanguageChooserDialog] = useState(false);
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
      setLanguages(languagesData);
    }
  }, [languagesData, setLanguages]);

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

  const { top } = useSafeAreaInsets();

  useEffect(() => {
    if (!currentLanguage && languagesData && languagesData.length) {
      setCurrentLanguage(languagesData[0]);
    }
  }, [currentLanguage, languagesData, setCurrentLanguage]);

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
      }}
    >
      {/* header */}
      <Appbar.Header
        statusBarHeight={Platform.OS === "ios" ? 5 : StatusBar.currentHeight}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={menuRoot?.root_name || pitaka.toString()} />

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

        <Pressable
          style={{
            paddingRight: 8,
          }}
          onPress={() => router.push("/search")}
        >
          <List.Icon icon={"magnify"} color="#fff" />
        </Pressable>

        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu} style={{}}>
              <Entypo
                name="dots-three-vertical"
                size={24}
                color={Color.oppositeBackgroundColor}
              />
            </TouchableOpacity>
          }
          style={{
            backgroundColor: Color.primaryBackgroundColor,
          }}
          anchorPosition="top"
          mode="elevated"
          contentStyle={{ width: 200, padding: 0 }}
          elevation={5}
          keyboardShouldPersistTaps="handled"
          theme={{
            roundness: 8,
          }}
        >
          <Menu.Item
            onPress={() => {
              closeMenu();
              setShowLanguageChooserDialog(true);
            }}
            title={`Language: ${
              currentLanguage ? currentLanguage.name : "Select Language"
            }`}
            titleStyle={{
              fontWeight: "600",
            }}
            containerStyle={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
            trailingIcon={() => (
              <AntDesign
                name="right"
                size={16}
                color={Color.oppositeBackgroundColor}
              />
            )}
          />
          <Menu.Item
            onPress={() => {
              closeMenu();
              router.push("/about");
            }}
            titleStyle={{
              fontWeight: "600",
            }}
            title="About"
          />
        </Menu>
      </Appbar.Header>

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

      {/* language chooser dialog */}
      <Dialog
        visible={showLanguageChooserDialog}
        onDismiss={() => setShowLanguageChooserDialog(false)}
        style={{
          borderRadius: spacing.lg,
          backgroundColor: Color.primaryBackgroundColor,
        }}
      >
        <FlatList
          data={languages}
          style={{
            marginBottom: padding.large,
          }}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={() => (
            <View
              style={{
                backgroundColor: Color.primaryBackgroundColor,
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  textAlign: "center",
                  marginBottom: margin.medium,
                }}
                variant="titleMedium"
              >
                Choose your language
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setCurrentLanguage(item);
                setShowLanguageChooserDialog(false);
              }}
            >
              <Dialog.Content
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: wp(4),
                }}
              >
                <View
                  style={{
                    backgroundColor: Color.borderColor,
                    paddingVertical: padding.tiny,
                    width: wp(10),
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    {item.iso_code}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                    }}
                    variant="bodyMedium"
                  >
                    {item.name}
                  </Text>

                  {currentLanguage?.iso_code === item.iso_code && (
                    <List.Icon
                      icon={({ color, size }) => (
                        <MaterialIcons name="done" size={wp(4)} color={color} />
                      )}
                    />
                  )}
                </View>
              </Dialog.Content>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.uid}
        />

        <Button
          onPress={() => {
            setShowLanguageChooserDialog(false);
          }}
          style={{
            position: "absolute",
            bottom: 10,
            right: 16,
          }}
          buttonColor={Color.primaryColor}
          textColor={Color.invertedTextColor}
        >
          Close
        </Button>
      </Dialog>
    </View>
  );
}
