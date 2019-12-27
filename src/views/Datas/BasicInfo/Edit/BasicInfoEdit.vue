<template>
    <a-modal
            :title="formData.id ? '编辑基础信息' : '新增基础信息'"
            :width="850"
            :visible="visible"
            @ok="handleSubmit"
            @cancel="handleCancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            :afterClose='afterClose'
            :closable="false"
            :maskClosable="true"
            :keyboard="true"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-row :gutter='{ md: 12, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            v-decorator="[
                                'name',
                                { 
                                    initialValue:formData.name,
                                    rules: [{ required: true, message: '请输入名称！' }] 
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="类型" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            v-decorator="[
                                'type',
                                { 
                                    initialValue:formData.type
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="创建时间" v-bind="formItemLayout" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
                        <a-date-picker style="width:100%;"
                            v-decorator="[
                                'createTime',
                                { 
                                    initialValue:formData.createTime
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 12, lg: 24, xl: 48 }' style="margin: 0 2px 0 -7px;">
                <a-form-item label="描述" v-bind="formItemLayout" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
                    <a-textarea :rows="4"
                        v-decorator="['illustration',{ 
                            initialValue: formData.illustration,
                        }]"
                    />
                </a-form-item>
            </a-row>

            <a-row :gutter='{ md: 12, lg: 24, xl: 48 }' style="margin-left: -10px;">
                <a-form-item label="图片" v-bind="formItemLayout" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
                    <div class="clearfix">
                        <a-upload  
                          listType="picture-card"
                          :fileList="fileList"
                          :accept="acceptPics"
                          @preview="handlePreview"
                          @change="handleChangePics"
                        >
                            <div v-if="(fileList.length < 5)">
                                <a-icon type="plus" />
                                <div class="ant-upload-text">上传图片</div>
                            </div>
                        </a-upload>
                        <a-modal :visible="previewVisible" :footer="null" @cancel="handlePicsCancel">
                            <img alt="example" style="width: 100%" :src="previewImage" />
                        </a-modal>
                    </div>
                </a-form-item>
            </a-row>

            <a-row :gutter='{ md: 12, lg: 24, xl: 48 }' style="margin-left: -10px;">
                <a-form-item label="上传附件" v-bind="formItemLayout" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
                    <a-upload
                        :beforeUpload="handleChangeFiles"
                        @change="handleChange"
                        :defaultFileList="defaultFileList"
                        >
                        <a-button style="width:102px;" v-if="defaultFileList.length < 5">
                          <a-icon type="upload" /> 上传
                        </a-button>
                    </a-upload>
                </a-form-item>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Table, Row, Col, Button, Input, Select, Icon, DatePicker, Tooltip, message, Upload} from 'ant-design-vue'
    import http from '../../../../utils/http'
    import moment from 'moment'
    import debounce from 'lodash/debounce'

    const dataUrl = {
        getDocument: '/api/document-info/get',
        documentAdd: '/api/document-info/add',
        documentUpdate: '/api/document-info/update',
        photoUpload: '/api/upload/document-photo',
        attachmentUpload: '/api/upload/document-attachment',
        photoDownload: '/api/download/document-photo',
        attachmentDownload: '/api/download/document-attachment',
    }

    export default {
        components: {
            AModal: Modal,
            AForm: Form,
            AFormItem: Form.Item,
            ATable: Table,
            ARow: Row,
            ACol: Col,
            AButton: Button,
            AInput: Input,
            ATextarea: Input.TextArea,
            AIcon: Icon,
            ADatePicker: DatePicker,
            ATooltip: Tooltip,
            ASelect: Select,
            ASelectOption: Select.Option,
            AUpload: Upload
        },
        name: 'BasicInfoEdit',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    id: null,
                    name: null,
                    type: null,
                    createTime: moment(new Date(), 'YYYY-MM-DD'),
                    illustration: null
                },
                loading: false,
                visible: false,
                confirmLoading: false,
                formItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 7},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 12},
                        md: {span: 10},
                    },
                },
                submitFormLayout: {
                    wrapperCol: {
                        xs: {span: 24, offset: 0},
                        sm: {span: 10, offset: 7},
                    },
                },
                previewVisible: false,
                previewImage: '',
                fileList: [],
                defaultFileList: [],
                documentPhotoIds: [],
                documentAttachmentIds: [],
                acceptPics: '.png,.jpg,.bmp,.jpeg,.gif,.svg',
                acceptFiles: '.xls,.xlsx,.doc,.pdf,.txt,.png,.jpg,.bmp,.jpeg,.gif,.svg'
            }
        },
        props: {
            companyList: Array
        },
        methods: {
            openModal(record) {
                this.visible = true;
                if (record){
                    this.formData.id = record.id;
                    http.post(dataUrl.getDocument, {
                        id: record.id
                    }).then(res => {
                        if (res.state) {
                            this.formData = {
                                id: record.id,
                                name: res.data ? res.data.name : null,
                                type: res.data.type ? res.data.type : null,
                                createTime: res.data.createTime ? moment(res.data.createTime, 'YYYY-MM-DD') : null,
                                illustration: res.data.illustration ? res.data.illustration : null
                            }
                            if(res.data.documentPhotos.length > 0) {
                                res.data.documentPhotos.map((item,index) =>
                                    this.fileList.push(
                                        {
                                            uid: item.id.toString(),
                                            name: item.fileName,
                                            status: 'done',
                                            url: dataUrl.photoDownload+'/'+item.id
                                        }
                                    )
                                )
                                this.fileList = this.fileList.slice(0,5);
                            }
                            if(res.data.documentAttachments.length > 0) {
                                res.data.documentAttachments.map((item,index) =>
                                    this.defaultFileList.push(
                                        {
                                            uid: item.id.toString(),
                                            name: item.fileName,
                                            status: 'done',
                                            url: dataUrl.attachmentDownload+'/'+item.id
                                        }
                                    )
                                )
                                this.defaultFileList = this.defaultFileList.slice(0,5);
                            }
                        } else {
                            message.warning(res.message)
                        }
                    })
                }
            },
            //上传培训照片
            handleChangePics({ fileList }) {
                const formData = new FormData();
                this.documentPhotoIds = [];
                formData.append('file', fileList[fileList.length-1].originFileObj);
                http.postFile(dataUrl.photoUpload, formData).then(res => {
                    if (res.state) {
                        message.success('上传成功');
                        this.fileList.push(
                            {
                                uid: res.data.id.toString(),
                                name: res.data.fileName,
                                status: 'done',
                                url: dataUrl.photoDownload+'/'+res.data.id
                            }
                        )   
                        this.documentPhotoIds = (this.fileList.map(item => {return parseInt(item.uid)}))
                    } else {
                        message.warning(res.message)
                    }
                })
                return false
            },
            handlePicsCancel () {
                this.previewVisible = false
            },
            //预览
            handlePreview (file) {
                this.previewImage = file.url || file.thumbUrl
                this.previewVisible = true
            },
            //附件
            handleChangeFiles(file,fileList) {
                const formData = new FormData();
                this.documentAttachmentIds = [];
                formData.append('file', file);
                http.postFile(dataUrl.attachmentUpload, formData).then(res => {
                    if (res.state) {
                        message.success('上传成功');
                        this.defaultFileList.push(
                            {
                                uid: res.data.id.toString(),
                                name: res.data.fileName,
                                status: 'done',
                                url: dataUrl.attachmentDownload+'/'+res.data.id
                            }
                        )  
                        this.documentAttachmentIds = (this.defaultFileList.map(item => {return parseInt(item.uid)}))                  
                    } else {
                        message.warning(res.message)
                    }
                })
                return false
            },
            filesUpload(file,id) {
                const formData = new FormData();
                formData.append('file', file);
                http.postFile(dataUrl.attachmentUpload, formData).then(res => {
                    if (res.state) {
                        message.success('上传成功');
                        this.defaultFileList.push(
                            {
                                uid: res.data.id.toString(),
                                name: res.data.originalName,
                                status: 'done',
                                url: dataUrl.attachmentDownload+'/'+res.data.id
                            }
                        )                    
                    } else {
                        message.warning(res.message)
                    }
                })
                return false
            },
            handleChange({file,fileList}) {
                fileList.map((item,index) => 
                    item.status = "done"
                );
            },
            //保存
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            this.confirmLoading = true
                            http.post(this.formData.id ? dataUrl.documentUpdate : dataUrl.documentAdd, {
                                id: this.formData.id ? this.formData.id : null,
                                name: values.name,
                                type: values.type,
                                createTime: values.createTime ? values.createTime.format('YYYY-MM-DD') : null,
                                illustration: values.illustration ? values.illustration : null,
                                documentPhotoIds: this.documentPhotoIds,
                                documentAttachmentIds: this.documentAttachmentIds
                            }).then(res => {
                                if (res.state) {
                                    message.success(res.message);
                                    this.visible = false;
                                    this.$emit("comfirmAdd");
                                } else {
                                    message.warning(res.message)
                                }
                                this.confirmLoading = false
                            })
                        }
                    },
                )
            },
            //取消
            handleCancel() {
                this.visible = false
            },
            afterClose() {
                this.formData.id = null;
                this.formData.name = null;
                this.formData.type = null;
                this.formData.createTime = moment(new Date(), 'YYYY-MM-DD');
                this.formData.illustration = null;
                this.fileList = [];
                this.defaultFileList = [];
                this.documentPhotoIds = [];
                this.documentAttachmentIds = [];
                this.visible = false;
                this.confirmLoading = false;
            }
        }
    }
</script>

<style scoped>
    .gmsj-form-span {
        color: rgba(0, 0, 0, 0.45);
        font-style: normal;
    }
</style>
