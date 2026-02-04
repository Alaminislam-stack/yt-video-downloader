import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Video, Music, Download } from 'lucide-react-native';

const VideoCard = ({ videoData, onDownload }) => {
    if (!videoData) return null;

    const { title, thumbnail, author, formats } = videoData;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
                <View style={styles.details}>
                    <Text style={styles.title} numberOfLines={2}>
                        {title}
                    </Text>
                    <Text style={styles.author}>{author}</Text>

                    <Text style={styles.sectionTitle}>Available Formats</Text>
                    <View style={styles.buttonContainer}>
                        {formats && formats.map((format, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.downloadButton,
                                    format.isAudio ? styles.audioButton : styles.videoButton
                                ]}
                                onPress={() => onDownload(format.url, format.isAudio ? 'mp3' : 'mp4')}
                            >
                                {format.isAudio ? (
                                    <Music color="#FFFFFF" size={18} />
                                ) : (
                                    <Video color="#FFFFFF" size={18} />
                                )}
                                <View style={styles.formatInfo}>
                                    <Text style={styles.buttonText}>
                                        {format.quality} ({format.extension.toUpperCase()})
                                    </Text>
                                    {!format.isAudio && !format.hasAudio && (
                                        <Text style={styles.noAudioText}>No Audio (Adaptive)</Text>
                                    )}
                                </View>
                                <Download color="#FFFFFF" size={18} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 40,
    },
    thumbnail: {
        width: '100%',
        height: 200,
    },
    details: {
        padding: 15,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    author: {
        color: '#888',
        fontSize: 14,
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    buttonContainer: {
        gap: 10,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 12,
        gap: 12,
    },
    formatInfo: {
        flex: 1,
    },
    videoButton: {
        backgroundColor: '#FF000022',
        borderWidth: 1,
        borderColor: '#FF0000',
    },
    audioButton: {
        backgroundColor: '#2C2C2C',
        borderWidth: 1,
        borderColor: '#444',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
    },
    noAudioText: {
        color: '#FF8A00',
        fontSize: 11,
        fontWeight: '400',
    },
});

export default VideoCard;
