import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const ItemsOrdered = ({ order_detail_items, showMore, product_options }) => {
    return (
        <>
            <View style={styles.page_sheet_view_inner_view}>
                {/* Product Name */}
                <View style={styles.small_container}>
                    <Text style={styles.small_container_text}>Product Name</Text>
                    <View style={styles.small_container_line} />
                </View>
                {/* SKU */}
                <View style={[styles.small_container, { width: "17.5%" }]}>
                    <Text style={styles.small_container_text}>SKU</Text>
                    <View style={styles.small_container_line} />
                </View>
                {/* Price  */}
                <View style={[styles.small_container, { width: "17.5%" }]}>
                    <Text style={styles.small_container_text}>Price</Text>
                    <View style={styles.small_container_line} />
                </View>
                {/* QTY */}
                <View style={[styles.small_container, { width: "17.5%" }]}>
                    <Text style={styles.small_container_text}>QTY</Text>
                    <View style={styles.small_container_line} />
                </View>
                {/* Subtotal */}
                <View style={[styles.small_container, { width: "17.5%" }]}>
                    <Text style={styles.small_container_text}>Subtotal</Text>
                    <View style={styles.small_container_line} />
                </View>




            </View>
            <View style={styles.list_main_cont}>
                {
                    order_detail_items.map((item, index) => {
                        return (
                            <>
                                {item?.price != 0 &&
                                    <>
                                        {/* Product Name */}
                                        <View style={[styles.small_container, { padding: 5 }]}>
                                            <Text style={[styles.small_container_text1, { marginTop: 20 }]}>{item.name}</Text>

                                            {/* Show More Button */}
                                            {
                                                item?.product_option !== undefined &&
                                                product_options.length == 0 &&
                                                <TouchableOpacity
                                                    onPress={() => showMore(item?.product_option, index)}
                                                    style={{ alignSelf: "flex-start" }}>
                                                    <Text style={[styles.small_container_text1, {
                                                        textDecorationLine: "underline",
                                                        color: "#08c",
                                                        marginVertical: 10
                                                    }]}>Show More</Text>
                                                </TouchableOpacity>}

                                            {/* Product Options */}
                                            {
                                                item?.product_option !== undefined &&
                                                product_options.length !== 0 &&
                                                <>

                                                    {product_options.map((po, po_index) => {
                                                        return (
                                                            <>

                                                                {po?.index_id == po_index &&
                                                                    <>
                                                                        {po?.custom_options.map((co) => {
                                                                            return (
                                                                                <>
                                                                                    <Text style={[styles.small_container_text1, { alignSelf: "flex-start", fontSize: 12, marginTop: 10 }]}>{co?.option_title}:</Text>
                                                                                    <Text style={[styles.small_container_text1, { alignSelf: "flex-start", marginTop: 5 }]}>{co?.option_value_name}</Text>
                                                                                </>
                                                                            )
                                                                        })}

                                                                        {
                                                                            po?.configurable_item_options !== undefined &&
                                                                            <>
                                                                                {
                                                                                    po?.configurable_item_options.map((cio) => {
                                                                                        return (
                                                                                            <>
                                                                                                <Text style={[styles.small_container_text1, { alignSelf: "flex-start", fontSize: 12, marginTop: 10 }]}>{cio?.option_title}:</Text>
                                                                                                <Text style={[styles.small_container_text1, { alignSelf: "flex-start", marginTop: 5 }]}>{cio?.option_value_name}</Text>

                                                                                            </>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </>
                                                                        }
                                                                    </>
                                                                }

                                                            </>
                                                        )
                                                    })}



                                                </>
                                            }



                                        </View>
                                        {/* SKU */}
                                        <View style={[styles.small_container, { width: "17.5%", padding: 5 }]}>
                                            <Text style={styles.small_container_text}>{item.sku}</Text>
                                        </View>
                                        {/* Price  */}
                                        <View style={[styles.small_container, { width: "17.5%" }]}>
                                            <Text style={styles.small_container_text}>{item.price}</Text>
                                        </View>
                                        {/* QTY */}
                                        <View style={[styles.small_container, { width: "17.5%" }]}>
                                            <Text style={styles.small_container_text}>{item.qty_ordered}</Text>
                                        </View>
                                        {/* Subtotal */}
                                        <View style={[styles.small_container, { width: "17.5%" }]}>
                                            <Text style={styles.small_container_text}>{item.original_price}</Text>
                                        </View>
                                    </>}

                            </>
                        )
                    })
                }
            </View>


        </>
    )
}

export default ItemsOrdered
// {item?.price == 0 &&
//     <>
//         {/* Product Name */}
//         <View style={[styles.small_container, { padding: 5 }]}>
//             <Text style={styles.small_container_text}>{item.parent_item?.name}</Text>
//         </View>
//         {/* SKU */}
//         <View style={[styles.small_container, { width: "17.5%", padding: 5 }]}>
//             <Text style={styles.small_container_text}>{item.parent_item?.sku}</Text>
//         </View>
//         {/* Price  */}
//         <View style={[styles.small_container, { width: "17.5%" }]}>
//             <Text style={styles.small_container_text}>{item?.parent_item?.price}</Text>
//         </View>
//         {/* QTY */}
//         <View style={[styles.small_container, { width: "17.5%" }]}>
//             <Text style={styles.small_container_text}>{item?.parent_item?.qty_ordered}</Text>
//         </View>
//         {/* Subtotal */}
//         <View style={[styles.small_container, { width: "17.5%" }]}>
//             <Text style={styles.small_container_text}>{item?.parent_item?.original_price}</Text>
//         </View>
//     </>}

const styles = StyleSheet.create({
    page_sheet_view_inner_view: {
        width: "95%",
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 10,
        // borderWidth:1
    },
    list_main_cont: {
        width: "95%",
        alignSelf: "center",
        // borderWidth: 0,
        flexWrap: "wrap",
        flexDirection: "row"
    },
    small_container: {
        width: "30%",
        justifyContent: "flex-start",
        alignItems: "center",

    },
    small_container_text: {
        fontSize: 13,
        fontWeight: "500",
        color: "black",
        marginVertical: 20,
        textAlign: "left"
    },
    small_container_text1: {
        fontSize: 13,
        fontWeight: "500",
        color: "black",
        textAlign: "left"
    },
    small_container_line: {
        width: "100%",
        height: 1,
        backgroundColor: "#c1c1c1"
    }
})