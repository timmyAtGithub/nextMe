import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

const TextWithTitleScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>So funktioniert die App</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.bodyText}>
        Ah, du hast also endlich diese bahnbrechende App gefunden, die es dir ermöglicht, Bilder mit völlig fremden Menschen in deiner Nähe zu teilen? Wie aufregend! Kein Grund mehr, deine Momente für dich zu behalten – schließlich ist nichts sicherer als die Idee, dass jeder in deiner Umgebung wissen muss, was du gerade isst, wo du bist oder wie du dich in diesem exakt perfekten Winkel fotografiert hast. Alles, was du tun musst, ist ein Foto auszuwählen (hoffentlich ist es nicht das peinliche, das du gestern gemacht hast), und dann – tada! – mit einem simplen Klick auf "Teilen" ist es schon in den Händen von Unbekannten, die in der Nähe herumlaufen.

Natürlich sorgt die Funktion „In der Nähe“ dafür, dass du sofort mit den Leuten verbunden wirst, die du nie wieder sehen willst. Wer braucht schon private Alben, wenn du den Zauber des öffentlichen Lebens so hautnah erleben kannst? Und keine Sorge, deine Privatsphäre ist garantiert unantastbar – schließlich hast du das Foto ja freiwillig hochgeladen, und wer würde schon hinterfragen, ob jemand anders das gleiche Foto in ein paar Minuten weiterverbreitet? Viel Spaß beim Posten deiner intimsten Momente – und denk dran, in ein paar Jahren kannst du dich dann wundern, warum du in keiner App mehr sicher bist.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5', // Hintergrundfarbe der Seite
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Textfarbe der Überschrift
    textAlign: 'center',
  },
  textContainer: {
    backgroundColor: '#ffffff', // Weißer Hintergrund für den Textbereich
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  bodyText: {
    fontSize: 16,
    color: '#333', // Textfarbe des normalen Textes
    textAlign: 'left',
  },
});

export default TextWithTitleScreen;
