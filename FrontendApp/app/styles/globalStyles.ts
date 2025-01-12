import { StyleSheet } from 'react-native';

const GlobalStyles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#00000',
    marginLeft: 10,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    padding: 10,
    backgroundColor: '#1E1E1E',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#333',
    color: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#FFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: '70%',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: '70%',
  },
  media: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  rightBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  leftBubble: {
    alignSelf: 'flex-start',
    color: '#000',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  Bubbletext:{
    color: '#000',
  },
  mediaOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    
  }, 
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', 
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
  },
  
});

export default GlobalStyles;
