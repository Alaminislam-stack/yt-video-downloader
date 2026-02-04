import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Download } from 'lucide-react-native';
import Constants from 'expo-constants';

const Header = () => {
    return (
        <View style={styles.safeArea}>
            <View style={styles.container}>
                <Download color="#FF0000" size={32} strokeWidth={2.5} />
                <Text style={styles.title}>YT Downloader</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#121212',
        paddingTop: Constants.statusBarHeight,
    },
    container: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2C',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 12,
        letterSpacing: 0.5,
    },
});

export default Header;
