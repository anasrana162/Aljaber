import { StyleSheet, Text, View,Dimensions } from 'react-native'
import React from 'react'
const width = Dimensions.get("screen").width
const Main_Info = ({ data }) => {
    return (
        <View style={styles.mainContainer}>
            {
                data.map((item, index) => {

                    return (
                        <View
                            key={String(item?.id)}
                            style={styles.inner_main}
                        >
                            {/* {console.log("Size Main Info comp:", item)} */}
                            {item?.brands !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Brands</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.brands}</Text>
                                    </View>
                                </>
                            }
                            {item?.color !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Color</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.color}</Text>
                                    </View>
                                </>
                            }
                            {item?.size !== undefined &&
                                <>

                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Size</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.size}</Text>
                                    </View>
                                </>
                            }
                            {item?.model_no !== undefined &&
                                <>

                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Model No</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.model_no}</Text>
                                    </View>
                                </>
                            }
                            {item?.frame_color !== undefined &&
                                <>

                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Frame Color</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.frame_color}</Text>
                                    </View>
                                </>
                            }
                            {item?.contact_lenses !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Contact Lense Model</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.contact_lenses}</Text>
                                    </View>
                                </>
                            }
                            {item?.frame_shape !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Frame Shape</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.frame_shape}</Text>
                                    </View>
                                </>
                            }
                            {item?.frame_type !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Frame Type</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.frame_type}</Text>
                                    </View>
                                </>
                            }
                            {item?.frame_material !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Frame Material</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.frame_material}</Text>
                                    </View>
                                </>
                            }
                            {item?.bridge_size !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Bridge Size</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.bridge_size}</Text>
                                    </View>
                                </>
                            }
                            {item?.lens_size !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Lens Size</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.lens_size}</Text>
                                    </View>
                                </>
                            }
                            {item?.lense_color !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Lens Color</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.lense_color}</Text>
                                    </View>
                                </>
                            }
                            {item?.temple_color !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Temple Color</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.temple_color}</Text>
                                    </View>
                                </>
                            }
                            {item?.temple_material !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Temple Material</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.temple_material}</Text>
                                    </View>
                                </>
                            }
                            {item?.polarized !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Polarized</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.polarized}</Text>
                                    </View>
                                </>
                            }
                            {item?.chain_size !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Chain Size</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.chain_size}</Text>
                                    </View>
                                </>
                            }

                            {item?.contact_lens_diameter !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Contact Lense Diatmeter</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.contact_lens_diameter}</Text>
                                    </View>
                                </>
                            }
                            {item?.contact_lens_base_curve !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Contact Lense Base Curve</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.contact_lens_base_curve}</Text>
                                    </View>
                                </>
                            }
                            {item?.water_container_content !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Water Container Content (%)</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.water_container_content}</Text>
                                    </View>
                                </>
                            }
                            {item?.contact_lens_usage !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Contact Lens Usage</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.contact_lens_usage}</Text>
                                    </View>
                                </>
                            }
                            {item?.box_content_pcs !== undefined &&
                                <>
                                    <View style={styles.divide_view}>
                                        <Text style={[styles.item_text, { color: "#020621" }]}>Box Content (Pcs)</Text>
                                    </View>
                                    <View style={styles.divide_view}>
                                        <Text style={styles.item_text}>{item?.box_content_pcs}</Text>
                                    </View>
                                </>
                            }


                        </View>
                    )

                })
            }
        </View>
    )
}

export default Main_Info

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "flex-start",
        marginTop: 20,
        // backgroundColor:"red"
    },
    inner_main: {
        width: "100%",
        // backgroundColor:"green",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        // marginLeft: 10,
        marginTop: 10,
    },
    divide_view: {
        width: "40%",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    item_text: {
        fontSize: 14,
        fontWeight: "500",
        color: "#233486",
    }
})