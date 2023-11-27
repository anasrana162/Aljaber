import { Text, StyleSheet, Image, View, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, Pressable, FlatList } from 'react-native'
import React, { useCallback, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LottieView from 'lottie-react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
const width = Dimensions.get("screen").width
const imageUrl = "https://aljaberoptical.com/media/catalog/product/cache/92a9a8f6050de739a96ad3044e707950"

const ProductList = ({ data, loader, screenName, totalProductsLength, onFlatListEnd, navProps, sortBY, openFilterBoard, loaderDot, addToCart }) => {
    //  console.log("Products", data)

    const [openSort, setOpenSort] = useState(false)
    const [imageSelected, setImageSelected] = useState(null)
    const [imageSelectedIndex, setImageSelectedIndex] = useState(null)
    // const [dataLength, setDataLenght] = useState(data?.length)
    const [slicedLength, setSlicedLenght] = useState(20)
    const [slicedLoader, setSlicedLoader] = useState(false)

    const selectedItem = (item, index) => {
        // console.log("Item Product Slected:", item)
       
        navProps.navigate("ProductDetails", { product_details:  item, product_index: index })
    }

    const onEndReached = () => {
        setSlicedLoader(true)
        console.log("END Reached")
        console.log("Data length", data?.length)

        if (data?.length <= slicedLength) {
            console.log("no data to reload")
            setSlicedLoader(false)
        }
        if (data?.length > slicedLength) {
            setSlicedLenght(slicedLength + 10)
            setSlicedLoader(false)
        }

    }

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

    const OnTouchIn = (images, index) => {
        if (images[1]?.file == undefined) {
            setImageSelected(images[0]?.file)
            setImageSelectedIndex(index)
        } else {

            setImageSelected(images[1]?.file)
            setImageSelectedIndex(index)
        }
    }



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
                            <MaterialIcons size={25} name="keyboard-arrow-down" color="white" />

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
                                            <Text style={{ fontSize: 14, color: "black", fontWeight: "500" }}>{data.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        }

                    </View>

                    {/* Filter */}
                    <TouchableOpacity
                        // disabled={loaderFilter}
                        onPress={openFilterBoard}
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



            {loaderDot == true &&
                <View style={{
                    width: "80%",
                    height: 150,
                }} >
                    < LottieView source={require('../../../animations/dots_load.json')}
                        autoPlay={true}
                        resizeMode='cover'
                        loop

                    />
                </View>
            }

            {/* Products List */}
            {/* <ActivityIndicator size="large" color="black" style={{position:"absolute", bottom:10 ,zIndex:200}} /> */}
            {/* <ScrollView
                horizontal={(screenName == "Home" || screenName == "Cart") ? true : false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                // onScrollEndDrag={()=>{console.log("On ENd SCrool")}}
                style={{ width: width }}
            > */}
            {loader == true &&
                <View style={[styles.productList_cont, {
                    flexWrap: (screenName == "Home" || screenName == "Cart") ? null : "wrap",
                    marginBottom: (screenName == "Home" || screenName == "Cart") ? 20 : 320,
                    flexDirection: "row",
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

            {/* {data != null && <View style={[styles.productList_cont, {
                    flexWrap: (screenName == "Home" || screenName == "Cart") ? null : "wrap",
                    marginBottom: (screenName == "Home" || screenName == "Cart") ? 60 : 320,
                }]}> */}
            {data != null &&

                <FlatList
                    data={data.slice(0, slicedLength)}
                    keyExtractor={(item) => `${item?.id}`}
                    numColumns={(screenName == "Home" || screenName == "Cart") ? null : 2}
                    horizontal={(screenName == "Home" || screenName == "Cart") ? true : false}
                    initialNumToRender={20}
                    contentContainerStyle={[styles.productList_cont, {
                        width: (screenName == "Home" || screenName == "Cart") ? null : width,
                        // flexWrap: (screenName == "Home" || screenName == "Cart") ? null : "wrap",
                        // marginBottom: (screenName == "Home" || screenName == "Cart") ? 60 : 320,
                        // paddingLeft: (screenName == "Home" || screenName == "Cart") ? "80%" :null ,
                        paddingBottom: (screenName == "Home" || screenName == "Cart") ? null : "80%",
                    }]}
                    onEndReached={onEndReached}
                    ListFooterComponent={() => {
                        return (<>{
                            slicedLoader &&
                            <View style={{ backgroundColor: "#f0f0f0", width: width, height: 60, justifyContent: "center", alignItems: "center" }}>

                                <ActivityIndicator size="small" color="black" />
                            </View>}</>)
                    }}
                    renderItem={(products) => {
                        // console.log("products", products?.item)
                        var imageLink = ""
                        if (screenName == "Home" || screenName == "Cart") {
                            imageLink = products?.item?.media_gallery_entries[0]?.file
                        } else {
                            imageLink = products?.item?.image
                        }
                        return (
                            <Pressable
                                onPress={() => selectedItem(products?.item, products?.index)}
                                // onPressIn={() => OnTouchIn(products?.item?.media_gallery_entries, products?.index)}
                                // onPressOut={() => { setImageSelected(null); setImageSelectedIndex(null) }}
                                style={[styles.product_Cont, {
                                    borderWidth: imageSelectedIndex !== products?.index ? 0.2 : 1.5,
                                    borderRadius: 3,
                                }]}
                                activeOpacity={0.8}

                            >
                                <View style={styles.product_inner_Cont}>


                                    <Image
                                        resizeMode='stretch'
                                        source={{ uri: imageUrl + imageLink }}
                                        style={{ width: "70%", height: 80, borderRadius: 10 }}
                                    />


                                    <Text numberOfLines={2} style={styles.product_Name}>{products?.item?.brand}</Text>
                                    <Text numberOfLines={2} style={[styles.product_Name, { marginTop: 5, width: 160 }]}>{products?.item?.name}</Text>
                                    <Text style={[styles.product_Name, { fontSize: 13, marginTop: 5 }]}>AED {products?.item?.price}</Text>

                                    <View style={styles.addToCart_Outer_Cont}>
                                        <TouchableOpacity style={styles.wishlist_button}>
                                            <MaterialCommunityIcons name="cards-heart-outline" size={20} color="black" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => addToCart(products?.item, products?.index)}
                                            style={styles?.addToCart_Cont}>
                                            <MaterialCommunityIcons name="shopping-outline" size={18} color="white" style={{ marginRight: 5 }} />
                                            <Text style={styles.addToCart}>Add to Cart</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Pressable>
                        )
                    }}
                />}

            {/* // </View>} */}
            {/* </ScrollView > */}


            {/* {screenName == "Home" && <Image source={require('../../../../assets/separator-1.png')} style={{ width: width - 220, height: 18, marginBottom: 30, marginTop: -20 }} />} */}

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
        backgroundColor: "#222529",
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    filterBox_Text: {
        fontSize: 14,
        fontWeight: '700',
        color: "#ffffff",
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
        // height: "90%",
        // flexDirection: "row",
        // flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10,
        // marginBottom: 320,
    },
    product_Cont: {
        marginVertical: 10,
        marginHorizontal: 10,
        width: width / 2 - 20,
        height: 210,
        backgroundColor: "#fffff",
        // marginBottom: 50,
        alignItems: "center",


    },
    product_inner_Cont: {
        width: "100%",
        height: "100%",
        // elevation: 4,
        // backgroundColor: "white",
        // paddingBottom: 10,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.4,
        // shadowRadius: 1.5,
        // borderTopWidth: 0.4,
        // borderColor: "#bbb",
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
        color: "#ffff",
        textAlign: "center",
    },
    addToCart_Cont: {
        width: 105,
        height: 30,
        flexDirection: "row",
        backgroundColor: "#222529",
        justifyContent: "center",
        alignItems: "center",
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
    },
    addToCart_Outer_Cont: {
        flexDirection: "row",
        width: "100%",
        height: 30,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",

    },
    wishlist_button: {
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderWidth: 0.5,
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
    }


})
