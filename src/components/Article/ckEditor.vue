<template>
    <i-modal :value="ckeditorShow"  width="90%" :styles="{top: '5px'}" :title="'文章编辑: ' + xmetadata.title" :closable="false" :mask-closable="false" :scrollable="true">
        <div class="hahah">
        <i-form ref="formCustomx" :model="xmetadata" class="xmetadata" :rules="ruleCustom" :label-width="40" >
            <i-formItem label='标题' prop="title" :rules="ruleCustom.xmetadata">
                <i-input  type="text" v-model="xmetadata.title" placeholder="请输入标题"></i-input>
            </i-formItem>
             <i-formItem label='封面' prop="cover" >
                <i-input  type="text" v-model="xmetadata.cover" placeholder="请输入封面"></i-input>
            </i-formItem>
        </i-form>
        <ckeditor class="ck" v-model="editorData" :config="editorConfig"></ckeditor>
        </div>
        <div slot="footer">
            <i-button type="default" size="large" @click="modalCancel()">取消</i-button>
             <i-button type="success" size="large" @click="submit('formCustomx')">保存</i-button>
        </div>
    </i-modal>
</template>

<script>

export default {
    name: 'ckEditor',
    data() {
        const validateTitle = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('标题不能为空'));
            } else {
                callback();
            }
        };
        return {
            xmetadata: JSON.parse(JSON.stringify(this.title)),
            editorData: JSON.parse(JSON.stringify(this.editorData2)),
            data_bak: '',// 数据最初的样子，判定数据是否被修改
            editorConfig: {
            // The configuration of the editor.
                height: 430
            },
            ruleCustom: {
                xmetadata: [{
                    validator: validateTitle,
                    trigger: 'blur'
                }]
            },
        }
    },
    props: ['ckeditorShow','title','editorData2'],
    watch: {
        title:{
            handler: function (){
                console.log('change')
                this.xmetadata = JSON.parse(JSON.stringify(this.title))
                this.data_bak = JSON.stringify(this.title.title.trim('\n') + this.title.cover.trim('\n') + this.editorData2.trim('\n'))
            },
            deep: true
        },
        editorData2: function (){
          this.editorData = JSON.parse(JSON.stringify(this.editorData2))
          this.data_bak = JSON.stringify(this.title.title.trim('\n') + this.title.cover.trim('\n') + this.editorData2.trim('\n'))
        }
    },
    computed: {
    },
    mounted () {
    },  
    updated(){
        //console.log('upadated')
        //this.xmetadata = JSON.parse(JSON.stringify(this.title))
        //this.editorData = JSON.parse(JSON.stringify(this.editorData2))
    },
    methods: {
        modalCancel: function () {
            //this.xmetadata = {'title':''}
            //this.editorData = ''
            this.$emit('update:ckeditorShow', false)
        },
        submit: function (name){
            let self = this
            // check 项目 是否为空
            self.$refs[name].validate((valid) => {
                if (valid) {
                    console.log('验证成功')
                    // 判断数据有没有更改，没有更改，不上传，更改了才上传
                    let new_temp = JSON.stringify(self.xmetadata.title.trim('\n') + self.xmetadata.cover.trim('\n') + self.editorData.trim('\n'))
                    //console.log('xxx',new_temp,self.data_bak)
                    if  (new_temp === self.data_bak){
                        self.$Message.info('没有更改,无需更新!');
                    } else {
                        // 上传
                        //console.log('xmetadata',self.xmetadata,self.editorData)

                        let xdata = {
                            "article_id": self.xmetadata.id,
                            "detail": {
                                "title": self.xmetadata.title,
                                'cover': self.xmetadata.cover,
                                "content": self.editorData
                            }
                        }
                        self.$emit('update-article',xdata)
                    }
                }else{
                    self.$Message.error('提交失败');
                }

            })
            this.$emit('update:ckeditorShow', false)
        }
    }
}
</script>

<style scoped>
.hahah{
    height: 650px;
    max-height: 650px;
    overflow: auto;
}
>>>.ivu-form .ivu-form-item-label{
    text-align: left !important;
    font-weight: bold
}

</style>
