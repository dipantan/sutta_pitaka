/* eslint-disable react-hooks/exhaustive-deps */
import MenuCard from "@/components/MenuCard";
import { Color } from "@/constants/color";
import useLanguageStore from "@/stores/useLanguage";
import useMenuStore from "@/stores/useMenu";
import { NikayaMapper } from "@/utils";
import { margin, padding, spacing, wp } from "@/utils/responsive";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  LogBox,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Dialog,
  Menu,
  Text,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

LogBox.ignoreAllLogs();

export default function Index() {
  const [visible, setVisible] = React.useState(false);

  const navigation = useNavigation();

  const [showLanguageChooserDialog, setShowLanguageChooserDialog] =
    useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const fetchLanguage = useLanguageStore((state) => state.fetchLanguage);
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const setCurrentLanguage = useLanguageStore(
    (state) => state.setCurrentLanguage
  );
  const languages = useLanguageStore((state) => state.languages);
  const languageLoading = useLanguageStore((state) => state.loading);

  const fetchMenu = useMenuStore((state) => state.fetchMenu);
  const menu = useMenuStore((state) => state.menu);
  const menuError = useMenuStore((state) => state.error);
  const menuloading = useMenuStore((state) => state.loading);

  const { top } = useSafeAreaInsets();

  useEffect(() => {
    // dont fetch language if its already fetched
    if (!currentLanguage) {
      fetchLanguage();
    }
  }, []);

  useEffect(() => {
    if (currentLanguage) {
      fetchMenu("sutta", currentLanguage?.iso_code); // only fetch the sutta menu
    }
  }, [currentLanguage]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: null,
    });
  }, [navigation]);

  if (menuloading || languageLoading) {
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
        paddingTop: Platform.OS === "android" ? top : 0,
      }}
    >
      {/* header */}
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        {menu?.root_name && (
          <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>
            {menu?.root_name}
          </Text>
        )}

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
            onPress={() => {}}
            titleStyle={{
              fontWeight: "600",
            }}
            title="About"
          />
          {/* <Divider />
          <Menu.Item
            onPress={() => {}}
            titleStyle={{
              fontWeight: "600",
            }}
            title="About"
          /> */}
        </Menu>
      </View>

      {/* content */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
          backgroundColor: Color.primaryBackgroundColor,
        }}
      >
        <FlatList
          data={menu?.children?.slice(0, -1)} //remove the last item because it is not fall in the five nikaya
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
                {menu?.blurb}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <MenuCard
              description={item.blurb}
              headerTitle={item.translated_name || item.root_name}
              isExpanded={false}
              leftText={item.root_name}
              uid={item.uid}
              yellowBrickRoad={item.yellow_brick_road}
              yellowBrickRoadCount={item.yellow_brick_road_count}
              onPress={() => {
                router.push({
                  pathname: "/vaggaList/[uid]",
                  params: {
                    uid: NikayaMapper(item.uid),
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
                {menuError || "No menu available"}
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

                <Text
                  style={{
                    fontWeight: "600",
                  }}
                  variant="bodyMedium"
                >
                  {item.name}
                </Text>
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
