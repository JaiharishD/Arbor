import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, TextInput, Modal, Image, Alert, Dimensions } from 'react-native';
import { Filter, MapPin, Search, CheckCircle, Leaf, ShoppingBag, Heart, X, ChevronDown, ArrowUpDown, Star, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { type MarketItem } from '../types';
import { MOCK_MARKETPLACE } from '../data/mockData';

const { height } = Dimensions.get('window');

export default function MarketplaceScreen() {
    const { colors, isDarkMode, setTabBarVisible, marketplaceOrders, addMarketplaceOrder, deleteMarketplaceOrder } = useApp();
    const [items, setItems] = useState<MarketItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter & Sort State
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'price' | 'distance' | 'freshness'>('distance');
    const [showFilters, setShowFilters] = useState(false);

    // Item Detail State
    const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

    // Orders State
    const [showOrders, setShowOrders] = useState(false);

    useEffect(() => {
        // Load mock data immediately to ensure screen is never blank
        setItems(MOCK_MARKETPLACE);
        setLoading(false);

        // Optional: Try to fetch fresh data in background
        loadItemsInBackground();
    }, []);

    // Hide tab bar when modals are shown
    useEffect(() => {
        setTabBarVisible(!showFilters && !showOrders);
        return () => setTabBarVisible(true);
    }, [showFilters, showOrders, setTabBarVisible]);

    const loadItemsInBackground = async () => {
        try {
            const data = await api.getMarketplaceItems();
            if (data && data.length > 0) {
                setItems(data);
            }
        } catch (error) {
            // Ignore background fetch errors
            console.log('Background fetch failed, keeping mock data');
        }
    };


    const handleAction = (item: MarketItem) => {
        let actionText = '';
        let emoji = '';
        let orderType = '';

        switch (item.type) {
            case 'Swap':
                actionText = 'Swap Request Sent!';
                emoji = '🔄';
                orderType = 'Swap Request';
                break;
            case 'Sale':
                actionText = 'Added to Cart!';
                emoji = '🛒';
                orderType = 'Purchase';
                break;
            case 'Request':
                actionText = 'Offer Sent!';
                emoji = '🎁';
                orderType = 'Gift Request';
                break;
        }

        // Add to orders
        const newOrder = {
            id: Date.now(),
            item,
            type: orderType,
            timestamp: new Date().toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        addMarketplaceOrder(newOrder);

        Alert.alert(
            actionText,
            `You've initiated a ${item.type.toLowerCase()} for ${item.name}. The seller will be notified! ${emoji}`,
            [{ text: 'Awesome!', style: 'default' }]
        );
        setSelectedItem(null);
    };

    const handleDeleteOrder = (orderId: number) => {
        Alert.alert(
            'Delete Order',
            'Are you sure you want to remove this order?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteMarketplaceOrder(orderId)
                }
            ]
        );
    };

    const getSortedItems = (itemsToSort: MarketItem[]) => {
        return [...itemsToSort].sort((a, b) => {
            if (sortBy === 'price') {
                // Simple mock sort for price strings like "₹40/pack"
                const priceA = a.price ? parseInt(a.price.replace(/[^0-9]/g, '')) : 0;
                const priceB = b.price ? parseInt(b.price.replace(/[^0-9]/g, '')) : 0;
                return priceA - priceB;
            }
            if (sortBy === 'distance') {
                const distA = parseFloat(a.distance.replace(' km', ''));
                const distB = parseFloat(b.distance.replace(' km', ''));
                return distA - distB;
            }
            // Mock freshness sort
            return 0;
        });
    };

    const filteredItems = getSortedItems(items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory ? item.category === activeCategory : true;
        return matchesSearch && matchesCategory;
    }));

    const categories = ['Vegetable', 'Fruit', 'Herb', 'Flower', 'Succulent', 'Seeds', 'Supplies'];
    const sortOptions = [
        { id: 'distance', label: 'Nearest First', icon: MapPin },
        { id: 'price', label: 'Lowest Price', icon: ShoppingBag },
        { id: 'freshness', label: 'Freshest', icon: Leaf },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <View>
                    <Text style={[styles.title, { color: colors.primaryDark }]}>Marketplace</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Fresh from your neighbors</Text>
                </View>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={[styles.headerButton, { backgroundColor: colors.card }]}
                        onPress={() => setShowOrders(true)}
                    >
                        <ShoppingBag color={colors.text} size={20} />
                        {marketplaceOrders.length > 0 && (
                            <View style={[styles.orderBadge, { backgroundColor: colors.primary }]}>
                                <Text style={styles.orderBadgeText}>{marketplaceOrders.length}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.headerButton, { backgroundColor: (activeCategory || sortBy !== 'distance') ? colors.primary : colors.card }]}
                        onPress={() => setShowFilters(true)}
                    >
                        <Filter color={(activeCategory || sortBy !== 'distance') ? 'white' : colors.text} size={20} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
                    <Search size={20} color={colors.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search plants, produce..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.grid}>
                    {filteredItems.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No items found matching your search.</Text>
                        </View>
                    ) : (
                        filteredItems.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.card, { backgroundColor: colors.card }]}
                                onPress={() => setSelectedItem(item)}
                            >
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={item.image}
                                        style={styles.itemImage}
                                        resizeMode="cover"
                                    />
                                    <View style={[styles.freshnessBadge, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
                                        <Text style={styles.freshnessText}>{item.freshness}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardContent}>
                                    <View style={styles.headerRow}>
                                        <Text style={[styles.categoryText, { color: colors.primary }]}>{item.category}</Text>
                                        <View style={styles.distanceBadge}>
                                            <MapPin size={10} color={colors.textSecondary} />
                                            <Text style={[styles.distanceText, { color: colors.textSecondary }]}>{item.distance}</Text>
                                        </View>
                                    </View>

                                    <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>

                                    <View style={styles.sellerRow}>
                                        <Text style={[styles.sellerName, { color: colors.textSecondary }]} numberOfLines={1}>
                                            {item.seller}
                                        </Text>
                                        {item.isVerified && <CheckCircle size={14} color={colors.primary} style={{ marginLeft: 4 }} />}
                                    </View>

                                    <View style={[
                                        styles.typeBadge,
                                        item.type === 'Swap' ? { backgroundColor: '#dbeafe' } :
                                            item.type === 'Sale' ? { backgroundColor: '#dcfce7' } :
                                                { backgroundColor: '#fce7f3' }
                                    ]}>
                                        <Text style={[
                                            styles.typeText,
                                            item.type === 'Swap' ? { color: '#1d4ed8' } :
                                                item.type === 'Sale' ? { color: '#15803d' } :
                                                    { color: '#be185d' }
                                        ]}>
                                            {item.type === 'Swap' ? 'Swap' : item.type === 'Sale' ? item.price : 'Gift'}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            )}

            {/* Filter Modal */}
            <Modal
                visible={showFilters}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowFilters(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalBackdrop} onPress={() => setShowFilters(false)} />
                    <View style={[styles.simpleModal, { backgroundColor: colors.background }]}>
                        {/* Header */}
                        <View style={[styles.simpleModalHeader, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.simpleModalTitle, { color: colors.text }]}>Filters & Sort</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                            {/* Sort Section */}
                            <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>SORT BY</Text>
                            {sortOptions.map(option => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.sortOption,
                                        {
                                            borderColor: sortBy === option.id ? colors.primary : colors.border,
                                            backgroundColor: sortBy === option.id ? colors.primary + '10' : 'transparent'
                                        }
                                    ]}
                                    onPress={() => setSortBy(option.id as any)}
                                >
                                    <option.icon size={18} color={sortBy === option.id ? colors.primary : colors.textSecondary} />
                                    <Text style={[
                                        styles.sortText,
                                        { color: sortBy === option.id ? colors.primary : colors.text }
                                    ]}>{option.label}</Text>
                                </TouchableOpacity>
                            ))}

                            {/* Categories Section */}
                            <Text style={[styles.sectionHeader, { color: colors.textSecondary, marginTop: 24 }]}>CATEGORIES</Text>
                            <View style={styles.categoryGrid}>
                                <TouchableOpacity
                                    style={[
                                        styles.categoryChip,
                                        { backgroundColor: !activeCategory ? colors.primary : colors.card, borderWidth: 1, borderColor: !activeCategory ? colors.primary : colors.border }
                                    ]}
                                    onPress={() => setActiveCategory(null)}
                                >
                                    <Text style={[styles.categoryChipText, { color: !activeCategory ? 'white' : colors.text }]}>All</Text>
                                </TouchableOpacity>
                                {categories.map(cat => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={[
                                            styles.categoryChip,
                                            { backgroundColor: activeCategory === cat ? colors.primary : colors.card, borderWidth: 1, borderColor: activeCategory === cat ? colors.primary : colors.border }
                                        ]}
                                        onPress={() => setActiveCategory(cat)}
                                    >
                                        <Text style={[styles.categoryChipText, { color: activeCategory === cat ? 'white' : colors.text }]}>{cat}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        {/* Footer */}
                        <View style={[styles.simpleModalFooter, { borderTopColor: colors.border }]}>
                            <TouchableOpacity
                                style={[styles.applyButton, { backgroundColor: colors.primary }]}
                                onPress={() => setShowFilters(false)}
                            >
                                <Text style={styles.applyButtonText}>Show Results</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Orders Modal */}
            <Modal
                visible={showOrders}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowOrders(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalBackdrop} onPress={() => setShowOrders(false)} />
                    <View style={[styles.simpleModal, { backgroundColor: colors.background }]}>
                        {/* Header */}
                        <View style={[styles.simpleModalHeader, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.simpleModalTitle, { color: colors.text }]}>My Orders</Text>
                            <TouchableOpacity onPress={() => setShowOrders(false)}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                            {marketplaceOrders.length === 0 ? (
                                <View style={styles.emptyOrders}>
                                    <Text style={{ fontSize: 48, marginBottom: 16 }}>🛒</Text>
                                    <Text style={[styles.emptyOrdersText, { color: colors.textSecondary }]}>No orders yet!</Text>
                                    <Text style={[styles.emptyOrdersSubtext, { color: colors.textSecondary }]}>Browse the marketplace and make your first purchase</Text>
                                </View>
                            ) : (
                                marketplaceOrders.map(order => (
                                    <View key={order.id} style={[styles.orderCard, { backgroundColor: colors.card }]}>
                                        <View style={styles.orderImageContainer}>
                                            <Image
                                                source={order.item.image}
                                                style={styles.orderImage}
                                                resizeMode="cover"
                                            />
                                        </View>
                                        <View style={styles.orderDetails}>
                                            <Text style={[styles.orderName, { color: colors.text }]} numberOfLines={1}>
                                                {order.item.name}
                                            </Text>
                                            <Text style={[styles.orderSeller, { color: colors.textSecondary }]}>
                                                From {order.item.seller}
                                            </Text>
                                            <View style={styles.orderTypeRow}>
                                                <View style={[
                                                    styles.orderTypeBadge,
                                                    order.type === 'Swap Request' ? { backgroundColor: '#dbeafe' } :
                                                        order.type === 'Purchase' ? { backgroundColor: '#dcfce7' } :
                                                            { backgroundColor: '#fce7f3' }
                                                ]}>
                                                    <Text style={[
                                                        styles.orderTypeText,
                                                        order.type === 'Swap Request' ? { color: '#1d4ed8' } :
                                                            order.type === 'Purchase' ? { color: '#15803d' } :
                                                                { color: '#be185d' }
                                                    ]}>
                                                        {order.type}
                                                    </Text>
                                                </View>
                                                <Text style={[styles.orderTimestamp, { color: colors.textSecondary }]}>
                                                    {order.timestamp}
                                                </Text>
                                            </View>
                                            {order.item.price && (
                                                <Text style={[styles.orderPrice, { color: colors.primary }]}>
                                                    {order.item.price}
                                                </Text>
                                            )}
                                        </View>
                                        <TouchableOpacity
                                            style={[styles.deleteButton, { backgroundColor: colors.card }]}
                                            onPress={() => handleDeleteOrder(order.id)}
                                        >
                                            <Trash2 size={18} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            )}
                        </ScrollView>

                        {/* Footer */}
                        <View style={[styles.simpleModalFooter, { borderTopColor: colors.border }]}>
                            <TouchableOpacity
                                style={[styles.applyButton, { backgroundColor: colors.primary }]}
                                onPress={() => setShowOrders(false)}
                            >
                                <Text style={styles.applyButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Item Detail Modal */}
            <Modal
                visible={!!selectedItem}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedItem(null)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalBackdrop} onPress={() => setSelectedItem(null)} />
                    <View style={[styles.detailModal, { backgroundColor: colors.background }]}>
                        {selectedItem && (
                            <View style={styles.detailContent}>
                                {/* Header with Close Button */}
                                <View style={styles.detailHeaderRow}>
                                    <View>
                                        <Text style={[styles.detailCategory, { color: colors.primary }]}>{selectedItem.category}</Text>
                                        <Text style={[styles.detailTitle, { color: colors.text }]}>{selectedItem.name}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.detailCloseButton, { backgroundColor: colors.card }]}
                                        onPress={() => setSelectedItem(null)}
                                    >
                                        <X size={20} color={colors.text} />
                                    </TouchableOpacity>
                                </View>

                                {/* Image - Normal Size */}
                                <View style={styles.detailImageContainer}>
                                    <Image
                                        source={selectedItem.image}
                                        style={styles.detailImage}
                                        resizeMode="cover"
                                    />
                                    <View style={[styles.freshnessBadge, { backgroundColor: 'rgba(255,255,255,0.9)', top: 12, right: 12 }]}>
                                        <Text style={styles.freshnessText}>{selectedItem.freshness}</Text>
                                    </View>
                                </View>

                                {/* Seller Info */}
                                <View style={styles.sellerInfo}>
                                    <View style={styles.sellerAvatar}>
                                        <Text style={{ fontSize: 20 }}>👤</Text>
                                    </View>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={[styles.detailSellerName, { color: colors.text }]}>{selectedItem.seller}</Text>
                                            {selectedItem.isVerified && <CheckCircle size={14} color={colors.primary} style={{ marginLeft: 4 }} />}
                                        </View>
                                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{selectedItem.distance} away</Text>
                                    </View>
                                </View>

                                <Text style={[styles.detailDescription, { color: colors.textSecondary }]}>
                                    {selectedItem.description}
                                </Text>

                                <TouchableOpacity
                                    style={[
                                        styles.detailActionButton,
                                        selectedItem.type === 'Swap' ? { backgroundColor: '#1d4ed8' } :
                                            selectedItem.type === 'Sale' ? { backgroundColor: '#15803d' } :
                                                { backgroundColor: '#be185d' }
                                    ]}
                                    onPress={() => handleAction(selectedItem)}
                                >
                                    <Text style={styles.detailActionText}>
                                        {selectedItem.type === 'Swap' ? 'Request Swap' :
                                            selectedItem.type === 'Sale' ? `Buy for ${selectedItem.price}` :
                                                'Request Gift'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    filterButton: {
        padding: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 50,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    grid: {
        padding: 16,
        paddingTop: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    imageContainer: {
        height: 140,
        width: '100%',
        position: 'relative',
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    freshnessBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    freshnessText: {
        fontSize: 8,
        fontWeight: '600',
        color: '#166534',
    },
    cardContent: {
        padding: 12,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    distanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    distanceText: {
        fontSize: 10,
    },
    itemName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    sellerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sellerName: {
        fontSize: 12,
        fontWeight: '500',
    },
    typeBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    emptyContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    // Simple centered modal with guaranteed visibility
    simpleModal: {
        width: '90%',
        maxWidth: 500,
        height: '70%',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    simpleModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
    },
    simpleModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    simpleModalFooter: {
        padding: 20,
        borderTopWidth: 1,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 16,
        letterSpacing: 1.2,
    },
    sortOptions: {
        flexDirection: 'column',
        gap: 12,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 10,
    },
    sortText: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    filterFooter: {
        paddingTop: 16,
        borderTopWidth: 1,
    },
    applyButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    applyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Detail Modal
    detailModal: {
        width: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
    detailContent: {
        padding: 24,
    },
    detailHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    detailImageContainer: {
        height: 200,
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        position: 'relative',
    },
    detailImage: {
        width: '100%',
        height: '100%',
    },
    detailCloseButton: {
        padding: 8,
        borderRadius: 20,
    },
    detailCategory: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    detailTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    sellerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 12,
        marginBottom: 20,
    },
    sellerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    detailSellerName: {
        fontSize: 16,
        fontWeight: '600',
    },
    detailDescription: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },
    detailActionButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    detailActionText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Header Buttons
    headerButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    headerButton: {
        padding: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        position: 'relative',
    },
    orderBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    orderBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    // Orders Modal
    ordersContent: {
        flex: 1,
    },
    ordersContentContainer: {
        paddingBottom: 20,
    },
    emptyOrders: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyOrdersText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptyOrdersSubtext: {
        fontSize: 14,
        textAlign: 'center',
    },
    orderCard: {
        flexDirection: 'row',
        borderRadius: 12,
        marginBottom: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    orderImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 12,
    },
    orderImage: {
        width: '100%',
        height: '100%',
    },
    orderDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    orderName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    orderSeller: {
        fontSize: 12,
        marginBottom: 6,
    },
    orderTypeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    orderTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    orderTypeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    orderTimestamp: {
        fontSize: 10,
    },
    orderPrice: {
        fontSize: 14,
        fontWeight: '600',
    },
    deleteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
});
