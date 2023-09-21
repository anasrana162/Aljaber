import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

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

                            {item?.brands !== undefined &&
                                <>
                                <View style={styles.divide_view}>
                                    <Text style={[styles.item_text,{color:"#020621"}]}>Brands</Text>
                                </View>
                                <View style={styles.divide_view}>
                                    <Text style={styles.item_text}>{item?.brands}</Text>
                                </View>
                                </>
                            }
                             {item?.color !== undefined &&
                                <>
                                <View style={styles.divide_view}>
                                    <Text style={[styles.item_text,{color:"#020621"}]}>Color</Text>
                                </View>
                                <View style={styles.divide_view}>
                                    <Text style={styles.item_text}>{item?.color}</Text>
                                </View>
                                </>
                            }
                             {item?.size !== undefined &&
                                <>
                                <View style={styles.divide_view}>
                                    <Text style={[styles.item_text,{color:"#020621"}]}>Size</Text>
                                </View>
                                <View style={styles.divide_view}>
                                    <Text style={styles.item_text}>{item?.size}</Text>
                                </View>
                                </>
                            }
                            {item?.contact_lenses !== undefined &&
                                <>
                                <View style={styles.divide_view}>
                                    <Text style={[styles.item_text,{color:"#020621"}]}>Contact Lense Model</Text>
                                </View>
                                <View style={styles.divide_view}>
                                    <Text style={styles.item_text}>{item?.contact_lenses}</Text>
                                </View>
                                </>
                            }

                             {item?.contact_lens_diameter !== undefined &&
                                <>
                                <View style={styles.divide_view}>
                                    <Text style={[styles.item_text,{color:"#020621"}]}>Contact Lense Diatmeter</Text>
                                </View>
                                <View style={styles.divide_view}>
                                    <Text style={styles.item_text}>{item?.contact_lens_diameter}</Text>
                                </View>
                                </>
                            }
                            {item?.contact_lens_base_curve !== undefined &&
                                <>
                                <View style={styles.divide_view}>
                                    <Text style={[styles.item_text,{color:"#020621"}]}>Contact Lense Base Curve</Text>
                                </View>
                                <View style={styles.divide_view}>
                                    <Text style={styles.item_text}>{item?.contact_lens_base_curve}</Text>
                                </View>
                                </>
                            }
                             {item?.water_container_content !== undefined &&
                                <>
                                <View style={styles.divide_view}>
                                    <Text style={[styles.item_text,{color:"#020621"}]}>Water Container Content (%)</Text>
                                </View>
                                <View style={styles.divide_view}>
                                    <Text style={styles.item_text}>{item?.water_container_content}</Text>
                                </View>
                                </>
                            }
                             {item?.contact_lens_usage !== undefined &&
                                <>
                                <View style={styles.divide_view}>
                                    <Text style={[styles.item_text,{color:"#020621"}]}>Contact Lens Usage</Text>
                                </View>
                                <View style={styles.divide_view}>
                                    <Text style={styles.item_text}>{item?.contact_lens_usage}</Text>
                                </View>
                                </>
                            }
                             {item?.box_content_pcs !== undefined &&
                                <>
                                <View style={styles.divide_view}>
                                    <Text style={[styles.item_text,{color:"#020621"}]}>Box Content (Pcs)</Text>
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
        marginTop:20
    },
    inner_main: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginLeft:10,
        marginTop:10,
    },
    divide_view:{
        width:"40%",
        justifyContent:"center",
        alignItems:"flex-start",
    },
    item_text:{
        fontSize:14,
        fontWeight:"500",
        color:"#233486",
    }
})