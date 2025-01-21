import { StyleSheet } from 'react-native';

const lightTheme = {
  background: '#FFFFFF',
  header:'#cecece',
  bottom:'#cecece',
  text: '#000000',
  primary: '#fafafa',
  secondary: '#e4e5f1',
  error: '#B00020',
  border: '#E0E0E0',
  link: '#1E90FF',
  subtleText: '#666666',
  brandBlue: '#007AFF',
  destructive: '#FF3B30',
};

const darkTheme = {
  background: '#111312',
  header: '#212121',
  bottom:'#212121',
  text: '#FFFFFF',
  primary: '#282828',
  secondary: '#212121',
  error: '#CF6679',
  border: '#373737',
  link: '#1E90FF',
  subtleText: '#AAAAAA',
  brandBlue: '#007AFF',
  destructive: '#FF3B30',
};
  
export const getGlobalStyles = (isDarkMode: boolean) => {
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  const overlayLight = 'rgba(0, 0, 0, 0.4)';
  const overlayDark = 'rgba(255, 255, 255, 0.4)';
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    text: {
      color: theme.text,
    },
    button: {
      backgroundColor: theme.secondary,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: theme.text,
      fontWeight: 'bold',
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,  
      color: theme.text,
      padding: 10,
      borderRadius: 5,
      marginVertical: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    arrowBack: {
      marginLeft: 5,    
      alignItems: 'center',
      top: '35%',
    },

    //AuthStyles
    authInput: {
      borderWidth: 1,
      borderColor: theme.border,  
      color: theme.text,
      padding: 10,
      borderRadius: 6,
      marginVertical: 5,
      width : '90%',
      alignSelf:  'center',
    },
    authContainer: {
      flex: 1,
      backgroundColor: theme.background,
      top: '30%',
    },
    authText: {
      color: theme.text,
      textAlign: 'center',
      marginTop: 10,
    },
    authLink: {
      color: theme.link,
      fontWeight: 'bold',
    },

    //CameraStyles
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    camera: {
      flex: 1,
    },
    toggleButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    takePhotoContainer: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 100,
      justifyContent: 'space-evenly', 
      width: '80%', 
      alignSelf: 'center', 
    },
    
    takePhotoButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20,
    },
    
    //ChatStyles
    background: {
      backgroundColor: theme.background,
    },
    inputChat: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
      color: theme.text,
      width: '70%',
      padding: 10,
      bottom: 10,
      borderRadius: 5,
      marginVertical: 5,
    },
    header: {
      zIndex: 1,
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 30,          
      paddingVertical: 30,            
      left: 0,
      right: 0,
      backgroundColor: theme.header,
      width: '100%',
      height: '11%',                    
      top: 0,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerText: {
      color: theme.text,
      fontSize: 20,
      margin: 10,
      padding: 10,
      flexShrink: 1,                 
      marginHorizontal: 10,           
      textAlign: 'center', 
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 20,
      backgroundColor: theme.border,
      marginRight: 10,
    },
    profileImageList: {
      width: 45,
      height: 45,
      borderRadius: 20,
      backgroundColor: theme.border,
    },
    rightBubble: {
      alignSelf: 'flex-end',
      backgroundColor: theme.primary,
      padding: 10,
      borderRadius: 10,
      margin: 5,
    },
    leftBubble: {
      alignSelf: 'flex-start',
      backgroundColor: theme.secondary,
      padding: 10,
      borderRadius: 10,
      margin: 5,
    },
    media: {
      width: 150,
      height: 150,
      borderRadius: 10,
    },
    mediaOptions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      bottom: 10,
    },
    bubbleText: {
      color: theme.text,
      fontSize: 16,
      lineHeight: 20,
    },
    sendButton: {
      backgroundColor: theme.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      bottom: 10,
    },
    chatListContainer: {
      flex: 1,
    },
    messageContainer:{
      flex: 1,
      backgroundColor: theme.background,
      top: '30%',
    },
    chatList: {
      top: '10%',
      flexGrow: 1,
      padding: 10,
      width: '100%',
    },
    chatItem: {
      alignItems: 'center',
      flexDirection: 'row', 
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: theme.background,
      shadowColor: '#000', 
      shadowOffset: {
        width: 0, 
        height: 2, 
      },
      shadowOpacity: 0.5, 
      shadowRadius: 3.84, 
      elevation: 5,
      borderRadius: 5,
      marginBottom: 10,
      width: '100%',
    },
    chatDetails: {
      flex: 1,
    },
    friendName: {
      color: theme.text,
      fontWeight: 'bold',
      fontSize: 16,
    },
    lastMessage: {
      color: theme.text,
      marginTop: 5,
      fontSize: 14,
      flexDirection: 'row',
    },
    lastMessageTime: {
      color: theme.text,
      fontSize: 12,
    },
    emptyText: {
      color: theme.text,
      textAlign: 'center',
      marginTop: 20,
    },

    //BottomNavigationStyles
    navigation: {
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.bottom,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
    },
    navIcon: {
      bottom: 10,
      width: 35,
      height: 35,
    },

    //DraggableScalableStyles
    draggableText: {
      position: 'absolute',
      zIndex: 10,
    },
    textElement: {
      color: 'white',
      fontSize: 22,
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      padding: 5,
    },
    textWithBorder: {
      alignSelf: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      width: '100%',
    },
    textBoxFullWidth: {
      alignSelf: 'center',
    },

    userHeader: {
      zIndex: 1,
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', 
      paddingHorizontal: 30,          
      paddingVertical: 30,            
      left: 0,
      right: 0,
      backgroundColor: theme.header,
      width: '100%',
      height: '11%',                    
      top: 0,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    
    headProfileImage: {
      top: '35%',
      width: 50,
      height: 50,
      borderRadius: 25,               
      backgroundColor: theme.border,
    },
    
    headText: {
      top: '35%',
      color: theme.text,
      fontSize: 18,
      textAlign: 'center',
      flex: 1,                        
      marginLeft: 10,                 
    },
    
    headFriend: {
      top: '38%',
      height: 52,
      width: 70,
      padding: 10,                    
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderImage: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      color: theme.text,
      fontSize: 18,
    },

    //PhotoPreviewStyles
    toolButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: isDarkMode ? overlayDark : overlayLight,
      marginLeft: 5,
    },
    imageContainer: {
      flex: 1,
      position: 'relative',
      margin: 0,
      padding: 0,
    },
    image: {
      width: '100%',
      height: '100%',

      aspectRatio: 'auto',
      resizeMode: 'cover',
    },
    colorPicker: {
      flexDirection: 'row',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 80,
      left: 0,
      right: 0,
      paddingHorizontal: 10,
      zIndex: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: 10,
    },
    colorOption: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginHorizontal: 5,
    },
    sendButtonText: {
      color: theme.text,
      fontWeight: 'bold',
    },

    //Friends
    backButton: {
      top: 40,
      left: 10,
      zIndex: 1,
    },
    friendsContainer: {
      flex: 1,
      marginTop: 60, 
      paddingHorizontal: 10,
    },    
    searchBar: {
      alignItems: 'center',
      flex: 1,
      backgroundColor: theme.secondary,
      color: theme.text,
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      marginRight: 10,
    },
    resultItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      backgroundColor: theme.secondary,
      borderRadius: 10,
      marginBottom: 5,
    },
    name: {
      color: theme.text,
      fontSize: 16,
    },
    emptyMessage: {
      color: theme.text,
      textAlign: 'center',
      marginTop: 10,
    },
    addButton: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    listContainer: {
      paddingBottom: 20,
      width: '100%',
    },
    accept: {
      color: theme.primary,
      fontSize: 20,
      marginRight: 10,
    },
    sectionHeader: {
      fontSize: 18,
      color: theme.text,
      marginVertical: 10,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      marginTop: 50,
      width: '100%',
    },
    requestItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginVertical: 5,
      backgroundColor: theme.secondary,
      borderRadius: 10,
    },
    friendItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      marginVertical: 5,
      backgroundColor: theme.secondary,
      borderRadius: 10,
    },
    reject: {
      color: theme.error,
      fontSize: 20,
    },

    //GroupsStyles
    groupImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    groupName: {
      fontSize: 18,
      color: theme.text,
      marginLeft: 10,
    },
    messageList: {
      marginTop: '21%', 
      flexGrow: 1,
      padding: 10,
      paddingBottom: 20,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullImage: {
      width: '90%',
      height: '90%',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: theme.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: theme.secondary,
    },
    groupDescription: {
      fontSize: 16,
      color: theme.subtleText,
      textAlign: 'center',
      marginVertical: 10,
    },
    membersTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginTop: 20,
      marginBottom: 10,
    },
    membersList: {
      paddingBottom: 20,
    },
    memberItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: theme.background,
      borderRadius: 8,
      marginBottom: 10,
    },
    memberImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    memberName: {
      color: theme.text,
      fontSize: 16,
    },
    ownerLabel: {
      color: theme.subtleText,
      fontSize: 14,
      fontStyle: 'italic',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: theme.text,
      marginTop: 12,
      fontSize: 16,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      color: theme.error,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
    retryButton: {
      backgroundColor: theme.secondary, 
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    retryButtonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '600',
    },
    imagePicker: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.secondary,
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      height: 150,
      overflow: 'hidden',
    },
    imagePlaceholderText: {
      color: theme.subtleText,
      fontSize: 16,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '600',
      marginVertical: 16,
    },
    friendList: {
      flexGrow: 1,
    },
    friendItemSelected: {
      backgroundColor: theme.brandBlue,
    },
    createButton: {
      backgroundColor: theme.secondary,
      paddingVertical: 16,
      alignItems: 'center',
      borderRadius: 8,
      marginTop: 16,
    },
    createButtonDisabled: {
      backgroundColor: theme.border,
    },

    //Pictures
    usernameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sendButtonRando: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      zIndex: 10,
    },
    username: {
      color: theme.text,
      fontSize: 16,
    },
    headerRandoPics:  {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'absolute',
      top: 40,
      left: 0,
      right: 0,
      paddingHorizontal: 15,
      zIndex: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: 10,
    },
    loadingContainerPics: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainerPics: {
      flex: 1,
      marginTop: 60, 
      paddingHorizontal: 15,
    },
    listContentPics: {
      paddingTop: '11%',
      paddingBottom: 20,
    },
    pictureItemPics: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginBottom: 10,
      backgroundColor: isDarkMode ? '#212121' : '#FFFFFF',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    icons: {
      flexDirection: 'row',
    },
    iconButton: {
      marginLeft: 10,
    },
    pictureContainer: {
      flex: 1,
    },
    caption: {
      color: theme.text,
      fontSize: 18,
      textAlign: 'center',
      marginVertical: 10,
    },
    replyContainer: {
      position: 'absolute',
      bottom: 60,
      width: '90%',
      alignSelf: 'center',
      backgroundColor: isDarkMode ? '#333' : '#EEE',
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    replyInput: {
      color: theme.text,
      fontSize: 16,
      paddingVertical: 10,
      flex: 1,
    },
    infoContainer: {
      flex: 1,
    },
    time: {
      color: theme.subtleText,
      fontSize: 12,
    },

    //ProfileStyles
    profileContainer: {
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
    },
    contactName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
      textAlign: 'center',
    },
    profileImageProfiles: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 20,
    },
    contactAbout: {
      fontSize: 16,
      color: theme.subtleText,
      textAlign: 'center',
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    profileSection: {
      alignItems: 'center',
      marginVertical: 20,
    },
    actionContainer: {
      marginBottom: 30,
      paddingHorizontal: 20,
    },
    centeredProfileContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginTop: 20,
    },
    removeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.secondary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginTop: 20,
      minWidth: 180,
    },
    removeButtonDisabled: {
      opacity: 0.6,
    },
    modalContent: {
      backgroundColor: theme.background,
      padding: 24,
      borderRadius: 16,
      width: '85%',
      maxWidth: 400,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
    },
    modalText: {
      fontSize: 16,
      color: theme.subtleText,
      marginBottom: 24,
      textAlign: 'center',
      lineHeight: 22,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    cancelButton: {
      flex: 1,
      alignItems: 'center',
      padding: 14,
      borderRadius: 8,
      backgroundColor: theme.secondary,
      marginRight: 10,
    },
    confirmButton: {
      flex: 1,
      alignItems: 'center',
      padding: 14,
      borderRadius: 8,
      backgroundColor: theme.secondary,
    },
    cancelButtonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '600',
    },
    confirmButtonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '600',
    },
    createGroupButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.secondary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginTop: 20,
      minWidth: 180,
    },
    blockButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.secondary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginTop: 20,
      minWidth: 180,
    },
    blockButtonDisabled: {
      opacity: 0.6,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 5,
    },

    //Settings
    settingsContainer: {
      flex: 1,
      backgroundColor: theme.background,
      top: '30%',
    },
    textField: {
      padding: 16,
      backgroundColor: theme.background,
      borderRadius: 8,
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      color: theme.text,
    },
    error: {
      color: theme.error,
      marginBottom: 16,
    },
    textContainer: {
      backgroundColor: theme.background,
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
      color: theme.text,
      textAlign: 'left',
    },

    buttonContainer2: {
      backgroundColor: theme.background,
      borderRadius: 8,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: '#ccc',
      alignSelf: 'center',
      marginTop: 0,
      marginBottom: 16,
      width: '80%',
      height: 60,
      justifyContent: 'center',
    },
    
    
    
  });
};

export const lightThemeColors = lightTheme;
export const darkThemeColors = darkTheme;
