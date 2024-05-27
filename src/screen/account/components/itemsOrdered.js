import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import api from '../../../api/api'

const ItemsOrdered = ({ order_detail_items, reOrderBegin, reOrderItems, props, showMore, product_options, subtotal, shipping_handling, total, navProps }) => {


    const reOrder = async () => {
        var { userData } = props
        console.log("reOrderItems", reOrderItems);
        reOrderBegin()
        for (let i = 0; i < reOrderItems.length; i++) {

            await api.post("carts/mine/items", reOrderItems[i], {
                headers: {
                    Authorization: `Bearer ${userData?.token}`,
                },
            }).then((response) => {
                if (i == reOrderItems?.length - 1) {
                    // console.log("reaching end");
                    alert("Products Added to Cart")
                    reOrderBegin()
                    navProps.navigate("Cart")
                }
            }).catch((err) => {
                // if (err?.response?.data?.message == "You need to choose options for your item.")
                alert(err?.response?.data?.message)
                console.log("Add to cart item api error:  ", err.response)


            })

        }


    }


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
                                            <Text style={styles.small_container_text}><Text style={[styles.small_container_text, { fontSize: 11 }]}>AED</Text> {item.original_price}</Text>
                                        </View>
                                    </>}
                                {index !== 0 && <View style={{ width: "100%", height: 0.5, backgroundColor: "black" }} />}
                            </>
                        )
                    })
                }
            </View>

            <Text style={[styles.total_subtotal_shipping_text, { marginTop: 20, }]}>Subtotal:{"              "}AED {subtotal}</Text>
            <Text style={styles.total_subtotal_shipping_text}>Shipping & Handling:{"              "}AED {shipping_handling}</Text>
            <Text style={[styles.total_subtotal_shipping_text, { fontWeight: "700" }]}>Estimated Total:{"              "}AED {total}</Text>
            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-around", alignItems: "center", marginTop: 25, marginBottom: 20, }}>

                <TouchableOpacity
                    onPress={() => navProps.pop()}
                    style={{ padding: 10, alignSelf: "flex-start", }}>
                    <Text style={styles.back_to_my_orders_text}>Back to My Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => reOrder()}
                    style={{ padding: 10, alignSelf: "flex-start", borderWidth: 1, borderRadius: 30, borderColor: "#08c", }}>
                    <Text style={styles.back_to_my_orders_text}>Reorder</Text>
                </TouchableOpacity>
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
    },
    total_subtotal_shipping_text: {
        color: "#666666",
        fontSize: 14,
        fontWeight: "400",
        alignSelf: "flex-end",
        marginRight: 15,
        marginTop: 10
    },
    back_to_my_orders_text: {
        color: "#08c",
        fontWeight: "500",
        fontSize: 14,
    },
})