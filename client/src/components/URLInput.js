import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { Search } from 'lucide-react-native';

const URLInput = ({ onFetch, loading }) => {
    const [url, setUrl] = useState('');

    const handleFetch = () => {
        if (url.trim()) {
            onFetch(url.trim());
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Paste YouTube URL here..."
                    placeholderTextColor="#888"
                    value={url}
                    onChangeText={setUrl}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleFetch}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Search color="#FFFFFF" size={20} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        alignItems: 'center',
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    input: {
        flex: 1,
        height: 50,
        color: '#FFFFFF',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#FF0000',
        padding: 10,
        borderRadius: 8,
        marginLeft: 10,
    },
});

export default URLInput;
