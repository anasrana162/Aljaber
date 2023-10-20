import { Text, StyleSheet, Image, View, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LottieView from 'lottie-react-native';
const width = Dimensions.get("screen").width
const imageUrl = "https://aljaberoptical.com/media/catalog/product/cache/92a9a8f6050de739a96ad3044e707950"

const ProductList = ({ data, loader, screenName, navProps, sortBY, loaderFilter }) => {
    //  console.log("Products", data)


    const selectedItem = (item, index) => {
        // console.log("Item Product Slected:", item)
        navProps.navigate("ProductDetails", { product_details: item, product_index: index })
    }

    const [openSort, setOpenSort] = useState(false)

    const sort = [
        {
            id: 1,
            name: "Position",
            key: "position",
        },
        {
            id: 2,
            name: "Product Name",
            key: "product_name",
        },
        {
            id: 3,
            name: "Price",
            key: "price",
        },
        {
            id: 4,
            name: "Brands",
            key: "brands",
        },


    ]

    return (
        <View style={styles?.mainContainer}>

            {screenName == undefined &&
                <View style={styles.filterBoxes_Cont}>
                    {/* Sort By */}
                    <View style={{
                        width: width / 2 - 50,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <TouchableOpacity
                            // disabled={loaderFilter}
                            onPress={() => setOpenSort(!openSort)}
                            style={[styles.filterBox, { width: "100%", position: "absolute", zIndex: 200 }]}>
                            <Text style={styles?.filterBox_Text}>SORT BY</Text>
                            <MaterialIcons size={25} name="keyboard-arrow-down" color="#020621" />

                        </TouchableOpacity>
                        {openSort &&
                            <View style={styles.sort_dropdown_main_cont}>
                                {sort.map((data, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={String(data?.id)}
                                            style={styles.sort_dropdown_main_inner_cont}
                                            onPress={() => {
                                                setOpenSort(false)
                                                sortBY(data?.key)
                                            }}
                                        >
                                            <Text>{data.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        }

                    </View>

                    {/* Filter */}
                    <TouchableOpacity
                        disabled={loaderFilter}
                        style={styles.filterBox}>
                        <Text style={styles?.filterBox_Text}>FILTER</Text>
                    </TouchableOpacity>
                </View>}

            {screenName == "Home" &&
                <View style={{
                    width: width - 15,
                    height: 120,
                    borderRadius: 5,
                    overflow: "hidden"
                }}>

                    <Image
                        source={{ uri: "https://aljaberoptical.com/media/magestore/bannerslider/images/c/o/color_contact_lenses_web_banner_copy_3.jpg" }}
                        style={{ width: "100%", height: "100%", }}
                        resizeMode='stretch'
                    />


                    <View style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "black",
                        opacity: 0.7,
                        position: "absolute",
                        zIndex: 250,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Text style={{ fontSize: 22, fontWeight: "700", color: "white" }}>Products</Text>
                    </View>

                </View>}

            {/* {loaderFilter &&
                <LottieView source={require('../../../animations/tab_loader.json')}
                    autoPlay={true}
                    loop
                    style={{
                        width: "70%",
                        height: 2,
                        marginTop: 5
                    }} />
            } */}

            {/* Products List */}

            <ScrollView
                horizontal={screenName == "Home" ? true : false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{ width: width }}
            >
                {loader == true &&
                    <View style={[styles.productList_cont, {
                        flexWrap: screenName == "Home" ? null : "wrap",
                        marginBottom: screenName == "Home" ? 20 : 320,
                    }]}>

                        <View style={styles.product_Cont}>

                            <SkeletonPlaceholder  >
                                <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>

                                    <SkeletonPlaceholder.Item width={width / 2 - 30} height={110} borderRadius={10}  >

                                    </SkeletonPlaceholder.Item>

                                    <SkeletonPlaceholder.Item width={110} height={10} borderRadius={10} marginTop={10}  >

                                    </SkeletonPlaceholder.Item>
                                    <SkeletonPlaceholder.Item width={90} height={15} borderRadius={10} marginTop={10}  >
                                    </SkeletonPlaceholder.Item>
                                    <SkeletonPlaceholder.Item width={80} height={25} borderRadius={10} marginTop={10}  >
                                    </SkeletonPlaceholder.Item>

                                </View>
                            </SkeletonPlaceholder>
                        </View>

                        <View style={styles.product_Cont}>
                            <SkeletonPlaceholder >
                                <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                                    <SkeletonPlaceholder.Item width={width / 2 - 30} height={110} borderRadius={10}  >
                                    </SkeletonPlaceholder.Item>
                                    <SkeletonPlaceholder.Item width={110} height={10} borderRadius={10} marginTop={10}  >
                                    </SkeletonPlaceholder.Item>
                                    <SkeletonPlaceholder.Item width={90} height={15} borderRadius={10} marginTop={10}  >
                                    </SkeletonPlaceholder.Item>

                                    <SkeletonPlaceholder.Item width={80} height={25} borderRadius={10} marginTop={10}  >
                                    </SkeletonPlaceholder.Item>

                                </View>
                            </SkeletonPlaceholder>
                        </View>

                        <View style={styles.product_Cont}>

                            <SkeletonPlaceholder  >
                                <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>

                                    <SkeletonPlaceholder.Item width={width / 2 - 30} height={110} borderRadius={10}  >

                                    </SkeletonPlaceholder.Item>

                                    <SkeletonPlaceholder.Item width={110} height={10} borderRadius={10} marginTop={10}  >

                                    </SkeletonPlaceholder.Item>
                                    <SkeletonPlaceholder.Item width={90} height={15} borderRadius={10} marginTop={10}  >
                                    </SkeletonPlaceholder.Item>
                                    <SkeletonPlaceholder.Item width={80} height={25} borderRadius={10} marginTop={10}  >
                                    </SkeletonPlaceholder.Item>

                                </View>
                            </SkeletonPlaceholder>
                        </View>

                        <View style={styles.product_Cont}>

                            <SkeletonPlaceholder  >
                                <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>

                                    <SkeletonPlaceholder.Item width={width / 2 - 30} height={110} borderRadius={10}  >

                                    </SkeletonPlaceholder.Item>

                                    <SkeletonPlaceholder.Item width={110} height={10} borderRadius={10} marginTop={10}  >

                                    </SkeletonPlaceholder.Item>
                                    <SkeletonPlaceholder.Item width={90} height={15} borderRadius={10} marginTop={10}  >
                                    </SkeletonPlaceholder.Item>
                                    <SkeletonPlaceholder.Item width={80} height={25} borderRadius={10} marginTop={10}  >
                                    </SkeletonPlaceholder.Item>

                                </View>
                            </SkeletonPlaceholder>
                        </View>

                    </View>
                }

                {data != null && <View style={[styles.productList_cont, {
                    flexWrap: screenName == "Home" ? null : "wrap",
                    marginBottom: screenName == "Home" ? 20 : 320,
                }]}>
                    {
                        data.map((products, index) => {

                            //  console.log("products?.media_gallery_entries[0]?.file", products.price ,"  ",products.visibility)
                            return (
                                <View
                                    key={String(index)}
                                >
                                    <>
                                        {(products?.price > 0 && products?.visibility == 4 && products?.extension_attributes?.stock_item?.is_in_stock == true) && <TouchableOpacity
                                            onPress={() => selectedItem(products, index)}
                                            style={styles.product_Cont}
                                        >
                                            <View style={styles.product_inner_Cont}>
                                                <Image
                                                    resizeMode='stretch'
                                                    source={{ uri: imageUrl + products?.media_gallery_entries[0]?.file }}
                                                    style={{ width: "70%", height: 80, borderRadius: 10 }}
                                                />
                                                <Text numberOfLines={2} style={styles.product_Name}>{products?.brand}</Text>
                                                <Text numberOfLines={2} style={[styles.product_Name, { marginTop: 5, width: 160 }]}>{products?.name}</Text>
                                                <Text style={[styles.product_Name, { fontSize: 13, marginTop: 5 }]}>AED {products?.price}</Text>

                                                <TouchableOpacity style={styles?.addToCart_Cont}>
                                                    <Text style={styles.addToCart}>Add to Cart</Text>
                                                </TouchableOpacity>
                                            </View>



                                        </TouchableOpacity>}
                                    </>
                                </View>
                            )
                        })
                    }
                </View>}
            </ScrollView >

            {screenName == "Home" && <Image source={require('../../../../assets/separator-1.png')} style={{ width: width - 220, height: 18, marginBottom: 30, marginTop: -20 }} />}

        </View >
    )
}

export default ProductList;

const styles = StyleSheet.create({

    mainContainer: {
        width: width,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
    },

    filterBoxes_Cont: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginBottom: 10,
        zIndex: 200
    },

    filterBox: {
        width: width / 2 - 50,
        height: 40,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    filterBox_Text: {
        fontSize: 14,
        fontWeight: '700',
        color: "#020621",
    },

    sort_dropdown_main_cont: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        borderWidth: 1,
        top: 20,
        backgroundColor: "white",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    sort_dropdown_main_inner_cont: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        padding: 5,
        // marginVertical: 5
    },

    productList_cont: {
        width: "100%",
        height: "90%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 320,
    },
    product_Cont: {
        marginVertical: 10,
        marginHorizontal: 10,
        width: width / 2 - 20,
        height: 210,
        backgroundColor: "#fffff",
        marginBottom: 50,
        alignItems: "center",

    },
    product_inner_Cont: {
        width: "100%",
        height: "100%",
        elevation: 4,
        backgroundColor: "white",
        paddingBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 1.5,
        borderTopWidth: 0.4,
        borderColor: "#bbb",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    product_Name: {
        fontSize: 12,
        fontWeight: "600",
        color: "#020621",
        marginTop: 0,
        textAlign: "center",
    },
    addToCart: {
        fontSize: 12,
        fontWeight: "600",
        color: "#020621",
        textAlign: "center",
    },
    addToCart_Cont: {
        width: 80,
        height: 30,
        marginTop: 10,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5
    }


})