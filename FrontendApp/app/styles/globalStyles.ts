import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    color: '#FFF',
    borderRadius: 10,
    padding: 10,
  },
  sectionHeader: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#292929',
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#292929',
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    color: '#FFF',
    fontSize: 16,
  },
  accept: {
    color: 'green',
    fontSize: 20,
    marginRight: 10,
  },
  reject: {
    color: 'red',
    fontSize: 20,
  },
});

export default globalStyles;
