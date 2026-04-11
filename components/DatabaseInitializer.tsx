import * as SQLite from "expo-sqlite";
import { AnimatePresence, MotiView } from "moti";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import DatabaseService from "../utils/DatabaseService";

const { width, height } = Dimensions.get("window");

const BUDDHIST_QUOTES = [
  "Mind precedes all phenomena; mind is their chief; they are mind-made. (Dhammapada 1)",
  "Heedfulness is the path to the deathless; heedlessness is the path to death. (Dhammapada 21)",
  "Hatred is never appeased by hatred; by non-hatred alone is hatred appeased. (Dhammapada 5)",
  "You yourselves must strive; the Tathāgatas only show the way. (Dhammapada 276)",

  "All conditioned things are impermanent. (Sabbe saṅkhārā aniccā)",
  "All conditioned things are suffering. (Sabbe saṅkhārā dukkhā)",
  "All phenomena are not-self. (Sabbe dhammā anattā)",

  "This is suffering. This is the origin of suffering. This is the cessation of suffering. This is the path leading to the cessation of suffering. (Dhammacakkappavattana Sutta)",
  "Whatever is subject to arising is subject to cessation. (Dhammacakkappavattana Sutta)",

  "And what is right view? Knowledge of suffering, its origin, its cessation, and the path. (Magga-vibhaṅga Sutta)",
  "And what is right effort? The effort to prevent and abandon unwholesome states and to cultivate wholesome states. (Magga-vibhaṅga Sutta)",

  "Bhikkhus, all is burning. Burning with the fire of greed, hatred, and delusion. (Ādittapariyāya Sutta)",
  "Seeing thus, the instructed noble disciple becomes disenchanted with form, feeling, perception, formations, and consciousness. (Anattalakkhaṇa Sutta)",

  "In the seen there is only the seen; in the heard only the heard; in the sensed only the sensed; in the cognized only the cognized. (Bāhiya Sutta)",
  "When for you there is only the seen... then you will not be 'by that'. When you are not 'by that', you are neither here nor beyond nor in between. This is the end of suffering. (Bāhiya Sutta)",

  "Monks, form is not self. If form were self, it would not lead to affliction. (Anattalakkhaṇa Sutta)",
  "Feeling is impermanent, conditioned, dependently arisen. (Saṃyutta Nikāya)",

  "Dependent on ignorance arise formations; dependent on formations, consciousness. (Paṭicca-samuppāda)",
  "With the cessation of ignorance comes the cessation of formations. (Paṭicca-samuppāda)",

  "There is, monks, an unborn, unbecome, unmade, unconditioned. (Udāna 8.3)",
  "If there were not this unborn, unbecome, unmade, unconditioned, no escape would be known from the born, become, made, conditioned. (Udāna 8.3)",

  "Just as the great ocean has one taste, the taste of salt, so too this Dhamma has one taste, the taste of liberation. (Udāna 5.5)",
  "Monks, I teach suffering and the cessation of suffering. (Majjhima Nikāya)",

  "Be islands unto yourselves, be your own refuge, with no other refuge; with the Dhamma as your island. (Mahāparinibbāna Sutta)",
  "All formations are subject to decay. Strive on with diligence. (Mahāparinibbāna Sutta)",

  "Contentment is the greatest wealth. (Dhammapada 204)",
  "The one who conquers himself is the greatest victor. (Dhammapada 103)",

  "Not by silence does one become a sage if one is foolish and ignorant. (Dhammapada 268)",
  "Better than a thousand meaningless words is one meaningful word that brings peace. (Dhammapada 100)",
];

export const DatabaseInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isInitializing, setIsInitializing] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"downloading" | "decompressing">(
    "downloading",
  );
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const exists = await DatabaseService.checkDatabaseExists();
      if (exists) {
        setIsInitializing(false);
      } else {
        setIsInitializing(true);
        startInitialization();
      }
    };

    checkStatus();
  }, []);

  useEffect(() => {
    if (isInitializing === true) {
      const interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % BUDDHIST_QUOTES.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isInitializing]);

  const startInitialization = async () => {
    try {
      await DatabaseService.initialize((p, ph) => {
        setProgress(p);
        setPhase(ph);
      });

      // Verify database
      const db = SQLite.openDatabaseSync("suttacentral.db");
      db.execSync("PRAGMA journal_mode = WAL");

      // Check if table exists
      const tableCheck = db.getFirstSync<{ count: number }>(
        "SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='menus'",
      );
      if (!tableCheck || tableCheck.count === 0) {
        throw new Error(
          "Database initialization incomplete: missing menus table",
        );
      }

      setIsInitializing(false);
    } catch (err) {
      console.error("Initialization failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to initialize database",
      );
    }
  };

  if (isInitializing === false) {
    return <>{children}</>;
  }

  if (isInitializing === null) {
    return (
      <View style={[styles.container, { backgroundColor: "#000" }]}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require("../assets/images/budhha.jpeg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 1000 }}
            style={styles.content}
          >
            <MotiView
              from={{ rotate: "0deg" }}
              animate={{ rotate: "360deg" }}
              transition={{
                loop: true,
                type: "timing",
                duration: 20000,
                repeatReverse: false,
              }}
              style={styles.iconContainer}
            >
              <MotiView
                style={styles.dhammaWheel}
                from={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ loop: true, type: "timing", duration: 2000 }}
              />
            </MotiView>

            <Text style={styles.title}>Sutta Pitaka</Text>

            <View style={styles.quoteWrapper}>
              <AnimatePresence exitBeforeEnter>
                <MotiView
                  key={quoteIndex}
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -10 }}
                  transition={{ type: "timing", duration: 800 }}
                >
                  <Text
                    style={styles.quote}
                  >{`"${BUDDHIST_QUOTES[quoteIndex]}"`}</Text>
                </MotiView>
              </AnimatePresence>
            </View>

            <View style={styles.progressSection}>
              <Text style={styles.phaseText}>
                {phase === "downloading"
                  ? "Downloading Wisdom..."
                  : "Unfolding the Dhamma..."}
              </Text>
              <ProgressBar
                progress={progress || 0.05}
                color="#FFD700"
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {Math.round((progress || 0) * 100)}%
              </Text>
            </View>

            {error && (
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={styles.errorBox}
              >
                <Text style={styles.errorText}>{error}</Text>
                <Text onPress={startInitialization} style={styles.retryText}>
                  Retry
                </Text>
              </MotiView>
            )}
          </MotiView>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "85%",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 40,
  },
  dhammaWheel: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#FFD700",
    borderStyle: "dashed",
  },
  title: {
    fontSize: 32,
    fontWeight: "300",
    color: "#fff",
    letterSpacing: 4,
    marginBottom: 60,
    textTransform: "uppercase",
  },
  quoteWrapper: {
    height: 100,
    justifyContent: "center",
    marginBottom: 60,
  },
  quote: {
    fontSize: 18,
    color: "#fff",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 28,
  },
  progressSection: {
    width: "100%",
    alignItems: "center",
  },
  phaseText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 12,
    letterSpacing: 1,
    opacity: 0.8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  progressText: {
    color: "#fff",
    marginTop: 8,
    fontSize: 12,
  },
  errorBox: {
    marginTop: 30,
    alignItems: "center",
  },
  errorText: {
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 10,
  },
  retryText: {
    color: "#FFD700",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
