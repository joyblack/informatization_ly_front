<template>
    <a-form :form="form" @submit="search" layout='inline' v-if="!expand">
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="8" :sm='24'>
                <a-form-item label="搜索" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder="请根据登录名或用户姓名进行搜索！"
                             v-decorator="['search']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='14' :style="{marginTop:'20px'}">
                <a-button type="primary" html-type="submit">
                    搜索
                </a-button>
                <a-button :style="{ marginLeft: '8px' }" @click="resetSearch">
                    重置
                </a-button>
            </a-col>
        </a-row>
    </a-form>
</template>

<script>
    import {Button, Form, Row, Col, Input, Icon, Select} from 'ant-design-vue'

    export default {
        components: {
            AForm: Form,
            AFormItem: Form.Item,
            ARow: Row,
            ACol: Col,
            AButton: Button,
            AInput: Input,
            AIcon: Icon,
            ASelect: Select,
            ASelectOption: Select.Option,
        },
        name: 'UserListSearch',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        data() {
            return {
                expand: false,
                userType: null,
                userStatus: null,
                formItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 4},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 20},
                    },
                }
            }
        },
        methods: {
            search(e) {
                e.preventDefault();
                this.form.validateFields(
                    (err, values) => {
                        this.$parent.search(values)
                    },
                )
            },
            resetSearch() {
                this.form.resetFields();
                this.$parent.search({})
            },
            toggle() {
                this.expand = !this.expand
            },
        }
    }
</script>

<style scoped>

</style>
