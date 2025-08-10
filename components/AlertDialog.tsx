import React from "react";
import { StyleSheet } from "react-native";
import {
    Button,
    Card,
    Dialog,
    Paragraph,
    Portal,
    Title,
} from "react-native-paper";

const AlertDialog = ({
  visible = false,
  onDismiss = () => {},
  title = "Alert",
  message = "This is an alert message",
  buttons = [{ text: "OK", onPress: () => {}, mode: "contained" }],
  cardStyle = {},
  titleStyle = {},
  messageStyle = {},
}) => {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={[styles.dialog, cardStyle]}
      >
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <Title style={[styles.title, titleStyle]}>{title}</Title>
            <Paragraph style={[styles.message, messageStyle]}>
              {message}
            </Paragraph>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            {buttons.map((button, index) => (
              <Button
                key={index}
                mode={button.mode || "text"}
                onPress={() => {
                  button.onPress();
                  onDismiss();
                }}
                style={styles.button}
              >
                {button.text}
              </Button>
            ))}
          </Card.Actions>
        </Card>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    alignSelf: "center",
    width: "90%",
    maxWidth: 400,
  },
  card: {
    backgroundColor: "#fff",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  title: {
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginTop: 8,
  },
  actions: {
    justifyContent: "flex-end",
    padding: 8,
  },
  button: {
    marginLeft: 8,
  },
});

export default AlertDialog;
