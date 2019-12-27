<template>
    <div class="licencePage">

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'10px 0 20px'}">
            <a-spin :spinning="listLoading">
                <a-col :style="{padding:'0'}">
                    <a-button type="primary" @click="licenceAdd" v-if="showBtn">
                        <a-icon type="plus" />
                        新增证照信息
                    </a-button>
                </a-col>
                <a-col v-for="(item,index) in data" :key="index" class="licenceList" :style="{padding:'0'}">
                    <h3 style="margin-top:30px;">{{item.licenceType == 'LICENCE_MINING' ? '采矿许可证' : '安全生产许可证'}}</h3>
                    <ul>
                        <li><span>{{item.licenceType == 'LICENCE_MINING' ? '采矿许可证号:' : '安全生产许可证号:'}}</span>{{item.licenceNumber}}</li>
                        <li><span>有效期限:</span>{{item.expiryTime}}</li>
                        <li><span>颁证日期:</span>{{item.issueTime}}</li>
                        <li v-if="item.licenceType == 'LICENCE_MINING'"><span>矿井规模:</span>{{item.mineScale}}万吨/年</li>
                        <li v-if="item.licenceType == 'LICENCE_MINING'"><span>矿区面积:</span>{{item.mineArea}}km²</li>
                        <li v-if="item.licenceType == 'LICENCE_MINING'"><span>准采标高:</span>{{item.mineElevation}}</li>
                        <li><span>发证机关:</span>{{item.issueOffice}}</li>
                        <li v-if="item.leftDays !== null"><span>有效期到期剩余天数:</span>{{item.leftDays}}天</li>
                        <a class="editInfo" href="javascript:;" @click="edit(item.id)"><a-icon type="edit" />编辑</a>
                    </ul>
                </a-col>
            </a-spin>
        </a-row>

        <LicenceEdit ref="licenceEdit" @comfirmAdd="comfirmAdd"></LicenceEdit>
    </div>
</template>

<script>
    import {Table, Row, Alert, Button, Upload, Divider, Input, Spin, Col, message, Icon} from 'ant-design-vue'
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    import LicenceEdit from './../Edit/LicenceEdit'
    import http from '../../../../utils/http'

    const dataUrl = {
        getMyLicence: '/api/document-licence/getMyLicence',
        getMyInformation: '/api/account/getMyInformation',
        getApproach: '/api/document-licence/getApproach'
    };

    export default {
        components: {
            ARow: Row,
            ACol: Col,
            AAlert: Alert,
            AButton: Button,
            ATable: Table,
            AUpload: Upload,
            ADivider: Divider,
            AInput: Input,
            ASpin: Spin,
            AIcon: Icon,
            LicenceEdit
        },
        name: 'LicenceList',
        data() {
            return {
                licenceDetails: this.$route.params.details,
                dateTime:moment(new Date(),'YYYY-MM'),
                visible: false,
                loading: false,
                listLoading: false,
                title: '配置',
                data: null,
                miningTitle: '',
                safeTitle: '',
                showBtn: false,
                searchValue: {},
                formItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 8},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 16},
                    },
                }
            }
        },
        mounted(){
            this.loader();
        },
        methods: {
            //加载数据
            loader() {
                this.listLoading = true;
                http.post(this.licenceDetails === undefined ? dataUrl.getMyLicence :(this.licenceDetails === true ? dataUrl.getApproach:null), {
                }).then(res => {
                    if (res.state) {
                        this.data = res.data;
                        this.listLoading = false;
                        this.licenceDetails = undefined;
                        if(this.data.length < 2) {
                            this.showBtn = true;
                        } else {
                           this.showBtn = false; 
                        }
                    } else {
                        message.warning(res.message)
                    }
                })
            },
            //添加数据
            licenceAdd() {
                this.$refs.licenceEdit.openModal();
            },
            comfirmAdd() {
                this.loader();
            },
            //编辑
            edit(id) {
                this.$refs.licenceEdit.openModal(id);
            }
        }
    }
</script>

<style scoped>
    .licenceList h3 {
        color: #333;
        font-size: 16px;
        font-weight: bold;
        display: flex;
        align-items: center;
        padding-bottom: 10px;
        margin-bottom: 10px;
    }

    .licenceList h3:before {
        content: "";
        display: block;
        height: 18px;
        margin-right: 10px;
        border-left: 4px solid #408cf9;
    }

    .licenceList {
        margin: 0 0 40px !important;
    }

    .licenceList ul {
        width: 90%;
        padding: 20px 20px 0;
        margin: 0 auto;
        position: relative;
        display: flex;
        flex-flow: row wrap;
        list-style: none;
        border: 1px solid #eee;
        box-shadow: 0 0 20px rgba(0,0,0,.1);
    }

    .licenceList ul li {
        width: 29%;
        font-size: 15px;
        margin-bottom: 20px;
    }

    .licenceList ul li:nth-child(3n+1) {
        width: 42%;
    }

    .licenceList ul .editInfo {
        position: absolute;
        right: 20px;
        bottom: 20px;
    }

    .licenceList ul li span {
        padding-right: 5px;
        color: #999;
    }

    .ant-tabs-tabpane .ant-spin-spinning {
        margin: 10% 0 0 48%;
    }
</style>