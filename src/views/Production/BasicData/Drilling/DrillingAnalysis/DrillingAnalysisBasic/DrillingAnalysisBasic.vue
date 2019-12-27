<template>
    <div>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="24" :sm="24">
                <h3 class="titles">{{this.titles}}</h3>
            </a-col>
        </a-row>
        <a-card title="基础信息">
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="6" :sm="24">
                    <a-form-item label="开孔日期" v-bind="formItemLayout">
                        <a-date-picker :disabled="true"
                                       v-decorator="['drillTime',{ initialValue:formData.drillTime,rules: [] }]"
                                       :style="{width: '100%'}"/>
                    </a-form-item>
                </a-col>
                <a-col :md="6" :sm='24'>
                    <a-form-item label="钻孔类别" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-select style="width: 120px"
                                  :disabled="true"
                                  labelInValue
                                  v-decorator="['drillCategory',{ initialValue:formData.drillCategory,rules: [] }]"
                                  :style="{width: '100%'}"
                        >
                            <a-select-option value="THROUGH_LAYER_CATEGORY">穿层钻孔</a-select-option>
                            <a-select-option value="BEDDING_CATEGORY">顺层钻孔</a-select-option>
                            <a-select-option value="HIGH_POSITION_CATEGORY">高位钻孔</a-select-option>
                            <a-select-option value="GEOLOGY_CATEGORY">地质钻孔</a-select-option>
                            <a-select-option value="OTHER_CATEGORY">其他钻孔</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="6" :sm='24'>
                    <a-form-item label="钻孔类型" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-select style="width: 120px"
                                  :disabled="true"
                                  labelInValue
                                  v-decorator="['drillType',{ initialValue:formData.drillType,rules: [] }]"
                                  :style="{width: '100%'}"
                        >
                            <a-select-option value="GAS_TYPE">瓦斯</a-select-option>
                            <a-select-option value="GEOLOGY_TYPE">地质</a-select-option>
                            <a-select-option value="WATER_DETECTION_TYPE">探水</a-select-option>
                            <a-select-option value="OTHER_TYPE">其他</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="6" :sm='24'>
                    <a-form-item label="钻孔岩性" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-select style="width: 120px"
                                  :disabled="true"
                                  labelInValue
                                  v-decorator="['drillRockCharacter',{ initialValue:formData.drillRockCharacter,rules: [] }]"
                                  :style="{width: '100%'}"
                        >
                            <a-select-option value="COAL_LAYER">煤层</a-select-option>
                            <a-select-option value="ROCK_LAYER">岩层</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="6" :sm='24'>
                    <a-form-item label="钻孔设计总数" v-bind="formItemLayout">
                        <a-input placeholder="请输入钻孔设计总数！"
                                 :disabled="true"
                                 v-decorator="['totalDrillHoleNumber',{ initialValue:formData.totalDrillHoleNumber,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="6" :sm='24'>
                    <a-form-item label="设计总量（m）" v-bind="formItemLayout">
                        <a-input
                                :disabled="true"
                                v-decorator="['totalLength',{ initialValue:formData.totalLength,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="6" :sm='24'>
                    <a-form-item label="实际总量（m）" v-bind="formItemLayout">
                        <a-input
                                :disabled="true"
                                v-decorator="['realLength',{ initialValue:formData.realLength,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-card>
    </div>

</template>

<script>
    import {Form, Row, Col, Input, Select, DatePicker, Card} from 'ant-design-vue'
    import moment from 'moment'
    import http from '../../../../../../utils/http'

    const dataUrl = {
        getById: '/api/produce-drill-work/get',//获取基本信息数据
    };
    export default {
        name: "DrillingAnalysisBasic",
        components: {
            AForm: Form,
            ACard: Card,
            AFormItem: Form.Item,
            ARow: Row,
            ACol: Col,
            AInput: Input,
            ASelect: Select,
            ASelectOption: Select.Option,
            ADatePicker: DatePicker,
        },
        data() {
            return {
                titles: '',
                formData: {
                    id: this.$route.params.id,
                    drillWorkName: null,
                    drillTime: moment(new Date(), 'YYYY-MM-DD'),
                    drillCategory: {key: 'THROUGH_LAYER_CATEGORY'},
                    drillType: {key: 'GAS_TYPE'},//
                    drillRockCharacter: {key: 'COAL_LAYER'},
                    remarks: null
                },
                formItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 8},
                        md: {span: 8},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 16, offset: 0},
                        md: {span: 16, offset: 0},
                    },
                },
                submitFormLayout: {
                    wrapperCol: {
                        xs: {span: 24, offset: 0},
                        sm: {span: 20, offset: 0},
                    },
                },
            }
        },
        mounted() {
            this.loader()
        },
        methods: {
            //加载数据
            loader() {
                if (this.formData.id) {
                    http.post(dataUrl.getById, {id: this.formData.id}).then(res => {
                        if (res.state) {
                            this.titles = res.data.drillWorkName ? res.data.drillWorkName :null;
                            this.formData = {
                                id: res.data ? res.data.id : null,
                                drillWorkName: res.data.drillWorkName ? res.data.drillWorkName : null,
                                drillTime: res.data ? moment(res.data.drillTime, 'YYYY-MM-DD') : null,
                                drillCategory: {key: res.data.drillCategory ? res.data.drillCategory : null},
                                drillType: {key: res.data.drillType ? res.data.drillType : null},
                                drillRockCharacter: {key: res.data.drillRockCharacter ? res.data.drillRockCharacter : null},
                                totalDrillHoleNumber: res.data.totalDrillHoleNumber ? res.data.totalDrillHoleNumber : null,//钻孔设计总数
                                totalLength: res.data.totalLength ? res.data.totalLength : null,//钻孔总量
                                realLength: res.data ? res.data.realLength : null,//已打总量
                                totalLeftLength: res.data.totalLeftLength ? res.data.totalLeftLength : null,//未打总量
                                remarks: res.data ? res.data.remarks : null,
                            }
                        }
                    })
                }
            },
        }
    }
</script>

<style scoped>
    .titles {
        text-align: center;
        padding: 15px;
        font-weight: bolder;
        font-size: 1.2vw;
    }
</style>
