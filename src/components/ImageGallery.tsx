import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Modal, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageGalleryProps {
    images: (string | number)[];
    style?: any;
}

// Helper function to get the correct image source
const getImageSource = (img: string | number) => {
    return typeof img === 'string' ? { uri: img } : img;
};

export default function ImageGallery({ images, style }: ImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    if (!images || images.length === 0) return null;

    const renderThumbnails = () => {
        if (images.length === 1) {
            return (
                <TouchableOpacity onPress={() => setSelectedImageIndex(0)} style={styles.singleImageContainer}>
                    <Image source={getImageSource(images[0])} style={styles.singleImage} resizeMode="cover" />
                </TouchableOpacity>
            );
        }

        if (images.length === 2) {
            return (
                <View style={styles.twoImagesContainer}>
                    {images.map((img, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => setSelectedImageIndex(idx)}
                            style={styles.twoImageItem}
                        >
                            <Image source={getImageSource(img)} style={styles.twoImage} resizeMode="cover" />
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }

        if (images.length === 3) {
            return (
                <View style={styles.threeImagesContainer}>
                    <TouchableOpacity
                        onPress={() => setSelectedImageIndex(0)}
                        style={styles.threeImageLarge}
                    >
                        <Image source={getImageSource(images[0])} style={styles.threeImageLargeImg} resizeMode="cover" />
                    </TouchableOpacity>
                    <View style={styles.threeImageSmallContainer}>
                        {images.slice(1).map((img, idx) => (
                            <TouchableOpacity
                                key={idx + 1}
                                onPress={() => setSelectedImageIndex(idx + 1)}
                                style={styles.threeImageSmall}
                            >
                                <Image source={getImageSource(img)} style={styles.threeImageSmallImg} resizeMode="cover" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            );
        }

        // 4 or more images - 2x2 grid
        return (
            <View style={styles.gridContainer}>
                {images.slice(0, 4).map((img, idx) => (
                    <TouchableOpacity
                        key={idx}
                        onPress={() => setSelectedImageIndex(idx)}
                        style={styles.gridItem}
                    >
                        <Image source={getImageSource(img)} style={styles.gridImage} resizeMode="cover" />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <View style={[styles.container, style]}>
            {renderThumbnails()}

            {/* Fullscreen Modal */}
            <Modal
                visible={selectedImageIndex !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedImageIndex(null)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setSelectedImageIndex(null)}
                    >
                        <X size={30} color="white" />
                    </TouchableOpacity>

                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        contentOffset={{ x: (selectedImageIndex || 0) * SCREEN_WIDTH, y: 0 }}
                    >
                        {images.map((img, idx) => (
                            <View key={idx} style={styles.fullscreenImageContainer}>
                                <Image
                                    source={getImageSource(img)}
                                    style={styles.fullscreenImage}
                                    resizeMode="contain"
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    singleImageContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 8,
        overflow: 'hidden',
    },
    singleImage: {
        width: '100%',
        height: '100%',
    },
    twoImagesContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    twoImageItem: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    twoImage: {
        width: '100%',
        height: '100%',
    },
    threeImagesContainer: {
        flexDirection: 'row',
        gap: 4,
        height: 200,
    },
    threeImageLarge: {
        flex: 2,
        borderRadius: 8,
        overflow: 'hidden',
    },
    threeImageLargeImg: {
        width: '100%',
        height: '100%',
    },
    threeImageSmallContainer: {
        flex: 1,
        gap: 4,
    },
    threeImageSmall: {
        flex: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    threeImageSmallImg: {
        width: '100%',
        height: '100%',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    gridItem: {
        width: '49%',
        aspectRatio: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
    },
    fullscreenImageContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
});
