import { Text, StyleSheet, Image, View, Dimensions, NativeModules, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../../redux/actions/user"
import { bindActionCreators } from 'redux';
import PositiveY from '../../../animations/LinearY';
import LinearX from '../../../animations/LinearX';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FBListCont from './fbListCont';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

const FilterBoard = ({
    //Functions
    onDismiss,
    applyFilter,
    filterBoardOpen,
    removeFilter,
    // Data
    contact_lens_diameter, contact_lens_base_curve, water_container_content, contact_lens_usage, brands, size, model_no, box_content_pcs, color
}) => {

    // states for open value cantainer
    const [contact_lens_diameter_open, setcontact_lens_diameter_open] = useState(false)
    const [contact_lens_base_curve_open, setcontact_lens_base_curve_open] = useState(false)
    const [water_container_content_open, setwater_container_content_open] = useState(false)
    const [contact_lens_usage_open, setcontact_lens_usage_open] = useState(false)
    const [brands_open, setbrands_open] = useState(false)
    const [size_open, setsize_open] = useState(false)
    const [model_no_open, setmodel_no_open] = useState(false)
    const [box_content_pcs_open, setsbox_content_pcs_open] = useState(false)
    const [color_open, setcolor_open] = useState(false)

    // state for holding values
    const [contact_lens_diameter_state, setcontact_lens_diameter_state] = useState("")
    const [contact_lens_base_curve_state, setcontact_lens_base_curve_state] = useState("")
    const [water_container_content_state, setwater_container_content_state] = useState("")
    const [contact_lens_usage_state, setcontact_lens_usage_state] = useState("")
    const [brands_state, setbrands_state] = useState("")
    const [size_state, setsize_state] = useState("")
    const [model_no_state, setmodel_no_state] = useState("")
    const [box_content_pcs_state, setsbox_content_pcs_state] = useState("")
    const [color_state, setcolor_state] = useState("")

    // state for holding values
    // const [cld_check, setcld_check] = useState("")
    // const [clbc_check, setclbc_check] = useState("")
    // const [wcc_check, setwcc_check] = useState("")
    // const [clu_check, setclu_check] = useState("")
    // const [brands_check, setbrands_check] = useState("")
    // const [size_check, setsize_check] = useState("")
    // const [model_no_check, setmodel_no_check] = useState("")
    // const [bcp_check, setbcp_check] = useState("")
    // const [color_check, setcolor_check] = useState("")

    // states for pushing ids of filters for checkbox
    const [checkBox_cld, setcheckBox_cld] = useState([])
    const [checkBox_clbc, setcheckBox_clbc] = useState([])
    const [checkBox_wcc, setcheckBox_wcc] = useState([])
    const [checkBox_clu, setcheckBox_clu] = useState([])
    const [checkBox_brand, setcheckBox_brand] = useState([])

    // keys
    const [cld_key, setcld_key] = useState(0)
    const [clbc_key, setclbc_key] = useState(0)
    const [wcc_key, setwcc_key] = useState(0)
    const [clu_key, setclu_key] = useState(0)
    const [brand_key, setbrand_key] = useState(0)


    const openCheckBox = (id, code, product_ids) => {
        console.log()
        switch (code) {
            case "contact_lens_diameter":
                console.log("ID Recieved on contact_lens_diameter", id, "  ", product_ids)
                setcld_key(cld_key + 1)
                checkBox_cld.push(id)
                setcheckBox_cld(checkBox_cld)
                applyFilter(product_ids)
                break;

            case "contact_lens_base_curve":
                setclbc_key(clbc_key + 1)
                checkBox_clbc.push(id)
                setcheckBox_clbc(checkBox_clbc)
                applyFilter(product_ids)
                break;

            case "water_container_content":
                setwcc_key(wcc_key + 1)
                checkBox_wcc.push(id)
                setcheckBox_wcc(checkBox_wcc)
                applyFilter(product_ids)
                break;

            case "contact_lens_usage":
                setclu_key(clu_key + 1)
                checkBox_clu.push(id)
                setcheckBox_clu(checkBox_clu)
                applyFilter(product_ids)
                break;

            case "brands":
                setbrand_key(brand_key + 1)
                checkBox_brand.push(id)
                setcheckBox_brand(checkBox_brand)
                applyFilter(product_ids)
                break;

        }

    }
    const closeCheckBox = (id, code, product_ids) => {

        switch (code) {
            case "contact_lens_diameter":

                console.log("ID RECEIVED", id)
                const index = checkBox_cld.indexOf(id);
                checkBox_cld.splice(index, 1)
                setcld_key(cld_key + 1)
                setcheckBox_cld(checkBox_cld)
                removeFilter(product_ids)
                break;

            case "contact_lens_base_curve":
                console.log("ID RECEIVED", id)
                const index1 = checkBox_clbc.indexOf(id);
                checkBox_clbc.splice(index1, 1)
                setclbc_key(clbc_key + 1)
                setcheckBox_clbc(checkBox_clbc)
                removeFilter(product_ids)
                break;

            case "water_container_content":
                console.log("ID RECEIVED", id)
                const index2 = checkBox_wcc.indexOf(id);
                checkBox_wcc.splice(index2, 1)
                setwcc_key(wcc_key + 1)
                setcheckBox_wcc(checkBox_wcc)
                removeFilter(product_ids)
                break;

            case "contact_lens_usage":
                console.log("ID RECEIVED", id)
                const index3 = checkBox_clu.indexOf(id);
                checkBox_clu.splice(index3, 1)
                setclu_key(clu_key + 1)
                setcheckBox_clu(checkBox_clu)
                removeFilter(product_ids)
                break;
            case "brands":
                console.log("ID RECEIVED", id)
                const index4 = checkBox_brand.indexOf(id);
                checkBox_brand.splice(index4, 1)
                setbrand_key(brand_key + 1)
                setcheckBox_brand(checkBox_brand)
                removeFilter(product_ids)
                break;

        }

    }


    return (
        <>
            {filterBoardOpen == true ?
                <View style={styles.mainContainer}>
                    <TouchableOpacity
                        onPress={onDismiss}
                        style={styles.mainContainer1}>

                        {/* Animation Componet */}

                    </TouchableOpacity>
                    <LinearX style={styles.inner_main}>

                        <View style={styles.inner_main1}>

                            <ScrollView>



                                {contact_lens_diameter?.value?.length > 0 &&
                                    <FBListCont
                                        key={cld_key}
                                        filterData={contact_lens_diameter}
                                        filterData_Cont_Open={contact_lens_diameter_open}
                                        // checkBox={cld_check}
                                        checkBoxID={checkBox_cld}
                                        openCheckBox={(id, code, product_ids) => openCheckBox(id, code, product_ids)}
                                        closeCheckBox={(id, code, product_ids) => closeCheckBox(id, code, product_ids)}
                                        openFilterDataCont={() => setcontact_lens_diameter_open(!contact_lens_diameter_open)}
                                    />
                                }
                                {contact_lens_base_curve?.value?.length > 0 &&
                                    <FBListCont
                                        // key={clbc_key}
                                        filterData={contact_lens_base_curve}
                                        filterData_Cont_Open={contact_lens_base_curve_open}
                                        // checkBox={clbc_check}
                                        checkBoxID={checkBox_clbc}
                                        openCheckBox={(id, code, product_ids) => openCheckBox(id, code, product_ids)}
                                        closeCheckBox={(id, code, product_ids) => closeCheckBox(id, code, product_ids)}
                                        openFilterDataCont={() => setcontact_lens_base_curve_open(!contact_lens_base_curve_open)}
                                    />
                                }
                                {water_container_content?.value?.length > 0 &&
                                    <FBListCont
                                        filterData={water_container_content}
                                        filterData_Cont_Open={water_container_content_open}
                                        // checkBox={wcc_check}
                                        checkBoxID={checkBox_wcc}
                                        openCheckBox={(id, code, product_ids) => openCheckBox(id, code, product_ids)}
                                        closeCheckBox={(id, code, product_ids) => closeCheckBox(id, code, product_ids)}
                                        openFilterDataCont={() => setwater_container_content_open(!water_container_content_open)}
                                    />
                                }
                                {contact_lens_usage?.value?.length > 0 &&
                                    <FBListCont
                                        filterData={contact_lens_usage}
                                        filterData_Cont_Open={contact_lens_usage_open}
                                        // checkBox={wcc_check}
                                        checkBoxID={checkBox_clu}
                                        openCheckBox={(id, code, product_ids) => openCheckBox(id, code, product_ids)}
                                        closeCheckBox={(id, code, product_ids) => closeCheckBox(id, code, product_ids)}
                                        openFilterDataCont={() => setcontact_lens_usage_open(!contact_lens_usage_open)}
                                    />
                                }
                                {brands?.value?.length > 0 &&
                                    <FBListCont
                                        filterData={brands}
                                        filterData_Cont_Open={brands_open}
                                        // checkBox={wcc_check}
                                        checkBoxID={checkBox_brand}
                                        openCheckBox={(id, code, product_ids) => openCheckBox(id, code, product_ids)}
                                        closeCheckBox={(id, code, product_ids) => closeCheckBox(id, code, product_ids)}
                                        openFilterDataCont={() => setbrands_open(!brands_open)}
                                    />
                                }


                            </ScrollView>


                        </View>

                    </LinearX>
                </View> :
                null

            }
        </>
    )
}

export default FilterBoard

const styles = StyleSheet.create({
    mainContainer: {
        width: width,
        height: height,
        backgroundColor: "rgba(52,52,52,0.05)",
        position: "absolute",
        zIndex: 400
    },
    mainContainer1: {
        width: "100%",
        height: "100%",
        alignItems: "flex-start",
        backgroundColor: "rgba(52,52,52,0.05)",
        position: "absolute",
        zIndex: 1
    },
    inner_main: {
        width: width / 2.1,
        height: "100%",
        backgroundColor: "white",
        // position: "absolute",
        // left:0,
        zIndex: 400,
    },
    inner_main1: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        // position: "absolute",
        // left:0,
        zIndex: 400,
    },

})