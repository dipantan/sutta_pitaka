import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateStorage } from "zustand/middleware";

const zustandStorage: StateStorage = {
  setItem: (name, value) => AsyncStorage.setItem(name, value),
  getItem: (name) => AsyncStorage.getItem(name),
  removeItem: (name) => AsyncStorage.removeItem(name),
};

const clientStorage = AsyncStorage;

export { clientStorage, zustandStorage };
