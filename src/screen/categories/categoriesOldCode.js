<View style={styles.inner_main}>
<View style={styles.default_category_cont}>
    <ScrollView
        showsVerticalScrollIndicator={false}
    >
        <View style={styles.flatList_outerCont}>

            {
                this.state.defaultCategories?.map((item, index) => {
                    return (
                        <View
                            key={String(index)}>
                            {item?.is_active == "true" &&
                                <TouchableOpacity

                                    onPress={() => this.selectedItems(item, index, 'main')}
                                    style={styles.flatList_Cont}>

                                    <View style={{
                                        width: 70,
                                        height: 70,
                                        borderWidth: 1,
                                        borderRadius: 120,
                                        borderColor: "#020621",
                                        marginBottom: 10,
                                        overflow: "hidden",
                                        zIndex: 150,
                                    }}>
                                        {/* https://wpstaging51.a2zcreatorz.com/ */}
                                        {item?.placeHolder == "false" && <Image source={{ uri: "https://aljaberoptical.com/" + item?.img }} style={{ width: "100%", height: "100%" }} />}
                                        {item?.placeHolder == "true" && <Image source={{ uri: item?.img }} style={{ width: "100%", height: "100%" }} />}
                                    </View>
                                    <Text numberOfLines={2} style={styles.text_item}>{item?.name}</Text>
                                </TouchableOpacity>}
                        </View>
                    )
                })
            }
        </View>
    </ScrollView>
</View>
<View style={styles.sub_category}>
    <ScrollView
        //pagingEnabled 
        // horizontal
        showsVerticalScrollIndicator={false}
    // showsHorizontalScrollIndicator={false}
    //contentOffset={{ x: 6 }}
    >
        <View style={styles.flatList_outerCont_sub}>
            {
                this.state.selectedCat?.children_data.map((item, index) => {
                    // console.log(item)
                    return (
                        <View
                            key={String(index)}
                        >
                            {item?.is_active == true &&
                                <TouchableOpacity
                                    onPress={() => this.selectedItems(item, index, 'sub')}

                                    style={styles.flatList_Cont_sub}>

                                    <View style={{
                                        width: 100,
                                        height: 90,
                                        borderWidth: 1,
                                        borderColor: "#020621",
                                        borderRadius: 10,
                                        marginBottom: 10,
                                        overflow: "hidden",
                                        zIndex: 150,
                                    }}>

                                        {item?.placeHolder == "false" && <Image source={{ uri: "https://aljaberoptical.com/" + item?.img }} style={{ width: "100%", height: "100%" }} />}
                                        {item?.placeHolder == "true" && <Image source={{ uri: item?.img }} style={{ width: "100%", height: "100%" }} />}
                                    </View>
                                    <Text numberOfLines={1} style={styles.text_item}>{item?.name}</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    )
                })
            }
        </View>
    </ScrollView>
</View>
</View>