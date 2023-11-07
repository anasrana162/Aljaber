import { Text, StyleSheet, View, Dimensions, TouchableOpacity, Platform, Image, Modal, Pressable, ScrollView } from 'react-native'
import React, { Component } from 'react'

const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height

export class About_us extends Component {
    render() {
        return (
            <View style={styles.mainContainer}>
                <ScrollView style={{ width: width }}>

                    <View style={{
                        position: "absolute",
                        top: 50,
                        left: 10,
                        zIndex:100
                    }}>

                        <Text style={[styles.title,{color:"white",fontSize:24,fontWeight:"500"}]}>History</Text>
                        <Text style={[styles.title,{color:"white",fontSize:30,marginTop:5}]}>About us</Text>

                    </View>

                    <Image
                        source={{ uri: "https://aljaberoptical.com/media/wysiwyg/optical_couple.jpg" }}
                        style={{
                            width: "100%",
                            height: 180,
                        }}
                    />

                    {/* Our Story  */}
                    <Image
                        source={{ uri: "https://aljaberoptical.com/media/wysiwyg/al-jaber1.jpg" }}
                        style={styles.para_image}
                    />

                    {/* Title */}
                    <Text style={styles.title}>Our Story</Text>

                    {/* Paragraph */}
                    <Text style={styles.para}>Al Jaber Optical the leading optical and eyewear company in the UAE was founded in 1982 by Al Jaber Group. The company presently operates over 40 shops and still planning to expand in the immediate future, within the prominent shopping malls, bustling prime high streets and key commercial district across the UAE.</Text>
                    {/* Paragraph */}
                    <Text style={styles.para}>Al Jaber Optical offers a comprehensive range of eyewear and optical services across the board, through a wide range of modern optical products and facilities. This includes the sale of high quality vision-care products, fashionable eyewear and optical frames, prescriptive and stylish contact lenses, optical accessories as well as providing unmatched</Text>




                    {/* Our Promise  */}
                    <Image
                        source={{ uri: "https://aljaberoptical.com/media/wysiwyg/Untitled-1.jpg" }}
                        style={[styles.para_image, { marginTop: 60 }]}
                    />

                    {/* Title */}
                    <Text style={styles.title}>Our Promise</Text>

                    {/* Paragraph */}
                    <Text style={styles.para}>At Al Jaber Optical, it’s not just about brands and fashion; it’s about helping our customers make the right decision. This is only exemplified by the awards that the company has received over the years for its superior service in eye-care industry. Al Jaber Optical has been recognized time and again as the UAE’s most trusted brand of opticians with its never</Text>
                    {/* Paragraph */}
                    <Text style={styles.para}>Al Jaber Optical promises to be more enthusiastic and will ensure to offer products and services that are sophisticated and contemporary, ranking amongst the best in the country while setting it apart in a league of its own that is sure to find approval by discerning users in the region.</Text>




                    {/* Mission & Vision  */}
                    <Image
                        source={{ uri: "https://aljaberoptical.com/media/wysiwyg/Untitled-2.jpg" }}
                        style={[styles.para_image, { marginTop: 60 }]}
                    />

                    {/* Title */}
                    <Text style={styles.title}>Mission & Vision</Text>

                    {/* Paragraph */}
                    <Text style={styles.para}>Over the past years, Al Jaber Optical has been synonymous with quality and exceptional service, which reflect its position and achievements as a progressive market.</Text>
                    {/* Paragraph */}
                    <Text style={styles.para}>Al Jaber Optical comes out on top for the fourth year running, Selected as Best Service Performance Brand and selected as Best Service Performing Outlet in Optical Category for Outstanding Business Category for the 2012 cycle, at the Annual Business Excellence Award Ceremony 2013, which is usually including the Dubai Quality Award (DQA), Dubai Human...</Text>
                    {/* Paragraph */}
                    <Text style={styles.para}>Al Jaber Optical accepted the 2013 award at the Business Excellence Award Ceremony 2013, held at the World Trade Center on April 29th, 2013 in Dubai, under the patronage and presence of HH Sheikh Mohammed Bin Rashid Al Maktoum, Vice President of the U.A.E and Prime Minister and Ruler of Dubai.</Text>
                    {/* Paragraph */}
                    <Text style={[styles.para, { marginBottom: 40 }]}>This new winning sustains Al Jaber Optical reputation as one of the best brands offering various optical services in all its branches for the 2012, 2011, 2010 and 2009. This year’s Best Service Performing Outlet award went to Al Jaber Optical Bawadi Mall branch, where 2011's award went to Aswaaq Al Mizhar branch with 2010's Award went for Ibn Battuta Mall branch, and the...</Text>

                </ScrollView>
            </View>
        )
    }
}

export default About_us
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        width: width,
        height: height,
        backgroundColor: "white"
    },
    para_image: {
        marginTop: 20,
        width: "90%",
        height: 180,
        alignSelf: "center"
    },
    title: {
        marginTop: 20,
        marginLeft: 20,
        fontSize: 22,
        fontWeight: "600",
        color: "#848484",
        alignSelf: "flex-start"
    },
    para: {
        marginTop: 10,
        marginLeft: 20,
        fontSize: 14,
        fontWeight: "400",
        color: "black",
        alignSelf: "flex-start",
        width: width - 40,
        textAlign: "justify"
    },

})