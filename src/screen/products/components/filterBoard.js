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
    contact_lens_diameter, lense_color, frame_type,contact_lens_base_curve, water_container_content, contact_lens_usage, brands, size, model_no, box_content_pcs, color
}) => {

    // states for open value cantainer
    const [contact_lens_diameter_open, setcontact_lens_diameter_open] = useState(false)
    const [contact_lens_base_curve_open, setcontact_lens_base_curve_open] = useState(false)
    const [water_container_content_open, setwater_container_content_open] = useState(false)
    const [contact_lens_usage_open, setcontact_lens_usage_open] = useState(false)
    const [brands_open, setbrands_open] = useState(false)
    const [size_open, setsize_open] = useState(false)
    const [model_no_open, setmodel_no_open] = useState(false)
    const [box_content_pcs_open, setbox_content_pcs_open] = useState(false)
    const [color_open, setcolor_open] = useState(false)
    const [lense_color_open, setlense_color_open] = useState(false)
    const [frame_type_open, setframe_type_open] = useState(false)

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
    const [lense_color_state, setlense_color_state] = useState("")

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
    const [checkBox_size, setcheckBox_size] = useState([])
    const [checkBox_model_no, setcheckBox_model_no] = useState([])
    const [checkBox_bcp, setcheckBox_bcp] = useState([])
    const [checkBox_color, setcheckBox_color] = useState([])
    const [checkBox_lc, setcheckBox_lc] = useState([])
    const [checkBox_ft, setcheckBox_ft] = useState([])

    // keys
    const [cld_key, setcld_key] = useState(0)
    const [clbc_key, setclbc_key] = useState(0)
    const [wcc_key, setwcc_key] = useState(0)
    const [clu_key, setclu_key] = useState(0)
    const [brand_key, setbrand_key] = useState(0)
    const [size_key, setsize_key] = useState(0)
    const [model_no_key, setmodel_no_key] = useState(0)
    const [bcp_key, setbcp_key] = useState(0)
    const [color_key, setcolor_key] = useState(0)
    const [lc_key, setlc_key] = useState(0)
    const [ft_key, setft_key] = useState(0)


    const openCheckBox = (id, code, product_ids) => {
        switch (code) {
            case "contact_lens_diameter":
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

            case "size":
                setsize_key(size_key + 1)
                checkBox_size.push(id)
                setcheckBox_size(checkBox_size)
                applyFilter(product_ids)
                break;
            case "model_no":
                setmodel_no_key(model_no_key + 1)
                checkBox_model_no.push(id)
                setcheckBox_model_no(checkBox_model_no)
                applyFilter(product_ids)
                break;

            case "box_content_pcs":
                setbcp_key(bcp_key + 1)
                checkBox_bcp.push(id)
                setcheckBox_bcp(checkBox_bcp)
                applyFilter(product_ids)
                break;
            case "color":
                setcolor_key(color_key + 1)
                checkBox_color.push(id)
                setcheckBox_color(checkBox_color)
                applyFilter(product_ids)
                break;
            case "lense_color":
                setlc_key(lc_key + 1)
                checkBox_lc.push(id)
                setcheckBox_lc(checkBox_lc)
                applyFilter(product_ids)
                break;
            case "frame_type":
                setft_key(ft_key + 1)
                checkBox_lc.push(id)
                setcheckBox_ft(checkBox_ft)
                applyFilter(product_ids)
                break;

        }

    }
    const closeCheckBox = (id, code, product_ids) => {

        switch (code) {
            case "contact_lens_diameter":
                const index = checkBox_cld.indexOf(id);
                checkBox_cld.splice(index, 1)
                setcld_key(cld_key + 1)
                setcheckBox_cld(checkBox_cld)
                removeFilter(product_ids)
                break;

            case "contact_lens_base_curve":
                const index1 = checkBox_clbc.indexOf(id);
                checkBox_clbc.splice(index1, 1)
                setclbc_key(clbc_key + 1)
                setcheckBox_clbc(checkBox_clbc)
                removeFilter(product_ids)
                break;

            case "water_container_content":
                const index2 = checkBox_wcc.indexOf(id);
                checkBox_wcc.splice(index2, 1)
                setwcc_key(wcc_key + 1)
                setcheckBox_wcc(checkBox_wcc)
                removeFilter(product_ids)
                break;

            case "contact_lens_usage":
                const index3 = checkBox_clu.indexOf(id);
                checkBox_clu.splice(index3, 1)
                setclu_key(clu_key + 1)
                setcheckBox_clu(checkBox_clu)
                removeFilter(product_ids)
                break;

            case "brands":
                const index4 = checkBox_brand.indexOf(id);
                checkBox_brand.splice(index4, 1)
                setbrand_key(brand_key + 1)
                setcheckBox_brand(checkBox_brand)
                removeFilter(product_ids)
                break;

            case "size":
                const index5 = checkBox_size.indexOf(id);
                checkBox_size.splice(index5, 1)
                setsize_key(size_key + 1)
                setcheckBox_size(checkBox_size)
                removeFilter(product_ids)
                break;

            case "model_no":
                const index6 = checkBox_model_no.indexOf(id);
                checkBox_model_no.splice(index6, 1)
                setbcp_key(model_no_key + 1)
                setcheckBox_model_no(checkBox_model_no)
                removeFilter(product_ids)
                break;

            case "box_content_pcs":
                const index7 = checkBox_bcp.indexOf(id);
                checkBox_bcp.splice(index7, 1)
                setbcp_key(bcp_key + 1)
                setcheckBox_bcp(checkBox_bcp)
                removeFilter(product_ids)
                break;
            case "color":
                const index8 = checkBox_color.indexOf(id);
                checkBox_color.splice(index8, 1)
                setcolor_key(color_key + 1)
                setcheckBox_bcp(checkBox_color)
                removeFilter(product_ids)
                break;
            case "lense_color":
                const index9 = checkBox_lc.indexOf(id);
                checkBox_lc.splice(index9, 1)
                setlc_key(lc_key + 1)
                setcheckBox_lc(checkBox_lc)
                removeFilter(product_ids)
                break;
            case "frame_type":
                const index10 = checkBox_ft.indexOf(id);
                checkBox_ft.splice(index9, 1)
                setft_key(ft_key + 1)
                setcheckBox_ft(checkBox_ft)
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
                                {size?.value?.length > 0 &&
                                    <FBListCont
                                        filterData={size}
                                        filterData_Cont_Open={size_open}
                                        // checkBox={wcc_check}
                                        checkBoxID={checkBox_size}
                                        openCheckBox={(id, code, product_ids) => openCheckBox(id, code, product_ids)}
                                        closeCheckBox={(id, code, product_ids) => closeCheckBox(id, code, product_ids)}
                                        openFilterDataCont={() => setsize_open(!size_open)}
                                    />
                                }
                                {model_no?.value?.length > 0 &&
                                    <FBListCont
                                        filterData={model_no}
                                        filterData_Cont_Open={model_no_open}
                                        // checkBox={wcc_check}
                                        checkBoxID={checkBox_model_no}
                                        openCheckBox={(id, code, product_ids) => openCheckBox(id, code, product_ids)}
                                        closeCheckBox={(id, code, product_ids) => closeCheckBox(id, code, product_ids)}
                                        openFilterDataCont={() => setmodel_no_open(!model_no_open)}
                                    />
                                }
                                {box_content_pcs?.value?.length > 0 &&
                                    <FBListCont
                                        filterData={box_content_pcs}
                                        filterData_Cont_Open={box_content_pcs_open}
                                        // checkBox={wcc_check}
                                        checkBoxID={checkBox_bcp}
                                        openCheckBox={(id, code, product_ids) => openCheckBox(id, code, product_ids)}
                                        closeCheckBox={(id, code, product_ids) => closeCheckBox(id, code, product_ids)}
                                        openFilterDataCont={() => setbox_content_pcs_open(!box_content_pcs_open)}
                                    />
                                }

                                {lense_color?.value?.length > 0 &&
                                    <FBListCont
                                        filterData={lense_color}
                                        filterData_Cont_Open={lense_color_open}
                                        // checkBox={wcc_check}
                                        checkBoxID={checkBox_lc}
                                        openCheckBox={(id, code, product_ids) => openCheckBox(id, code, product_ids)}
                                        closeCheckBox={(id, code, product_ids) => closeCheckBox(id, code, product_ids)}
                                        openFilterDataCont={() => setlense_color_open(!lense_color_open)}
                                    />
                                }

                                {frame_type?.value?.length > 0 &&
                                    <FBListCont
                                        filterData={frame_type}
                                        filterData_Cont_Open={frame_type_open}
                                        // checkBox={wcc_check}
                                        checkBoxID={checkBox_ft}
                                        openCheckBox={(id, code, product_ids) => openCheckBox(id, code, product_ids)}
                                        closeCheckBox={(id, code, product_ids) => closeCheckBox(id, code, product_ids)}
                                        openFilterDataCont={() => setframe_type_open(!frame_type_open)}
                                    />
                                }


                                {color?.value?.length > 0 &&
                                    <FBListCont
                                        filterData={color}
                                        filterData_Cont_Open={color_open}
                                        isColor={true}
                                        // checkBox={wcc_check}
                                        checkBoxID={checkBox_color}
                                        openCheckBox={(id, code, product_ids) => openCheckBox(id, code, product_ids)}
                                        closeCheckBox={(id, code, product_ids) => closeCheckBox(id, code, product_ids)}
                                        openFilterDataCont={() => setcolor_open(!color_open)}
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
        zIndex: 400,
    },
    mainContainer1: {
        width: "100%",
        height: "100%",
        alignItems: "flex-start",
        backgroundColor: "rgba(52,52,52,0.05)",
        position: "absolute",
        zIndex: 1,

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
        // paddingBottom: 400,


    },

})