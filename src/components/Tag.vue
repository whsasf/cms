<template>
<div class="Url">
    <i-button type="success" @click="addTagShow">添加标签</i-button>
    <i-button type="success" @click="editClassShow=true">编辑分类</i-button>
    <i-button type="success" @click="setMainClassShow=true">设置主分类</i-button>
    <i-modal :value="setMainClassShow"  width="50%" :mask-closable="false" :scrollable="true">
        <div class="hahah">
        <i-form>
            <h2>设置主分类</h2><br>
            <i-select v-model="mainClass">
                <i-option v-for="klass in classSelect" :value="klass" :key="klass">{{klass}}</i-option>
            </i-select>
        </i-form>
        </div>
        <div slot="footer">
            <i-button type="default" size="large" @click="setMainClassShow=false">取消</i-button>
             <i-button type="success" size="large" @click="setMainClass">保存</i-button>
        </div>
    </i-modal>
    <i-modal :value="editClassShow"  width="50%" :mask-closable="false" :scrollable="true">
        <div class="hahah">
        <i-form>
            <h2>编辑分类</h2><br>
            <i-select v-model="new_classes" multiple filterable allow-create>
                <i-option v-for="klass in classSelect" :value="klass" :key="klass">{{klass}}</i-option>
            </i-select>
        </i-form>
        </div>
        <div slot="footer">
            <i-button type="default" size="large" @click="editClassShow=false">取消</i-button>
             <i-button type="success" size="large" @click="submitClass()">保存</i-button>
        </div>
    </i-modal>
    <i-modal :value="tagEditShow"  width="30%" :mask-closable="false" :scrollable="true">
        <div class="hahah">
        <i-form>
            <i-formItem label='标签名称' prop="title">
                <i-input  type="text" v-model="current_name" placeholder="请输入名称"></i-input>
            </i-formItem>
            <i-formItem label='标签分类' prop="class">
                <i-select v-model="current_classes" multiple placeholder="请选择标签分类">
                    <i-option v-for="klass in classSelect" :value="klass" :key="klass">{{klass}}</i-option>
                </i-select>
            </i-formItem>
            <i-formItem label='是否加入放映厅' prop="isFilm">
                <i-select v-model="isFilm" placeholder="是否加入放映厅">
                    <i-option value="否">否</i-option>
                    <i-option value="是">是</i-option>
                </i-select>
            </i-formItem>
        </i-form>
        </div>
        <div slot="footer">
            <i-button type="default" size="large" @click="tagEditShow=false">取消</i-button>
             <i-button type="success" size="large" @click="submit()">保存</i-button>
        </div>
    </i-modal>
    <i-page :total="itemCount" :current="page" placement="bottom"  :page-size="page_size" :page-size-opts=[10,20,30,40,50,100] size="small" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="page_sizeChange" />
    <i-table class="Url-table" :columns="columns1" :data="articlesData" :loading="loading" @on-selection-change="handleSelectRow()" ref="table" stripe border @on-filter-change="handleFilter" @on-sort-change="handleSort">
        <template slot-scope="{ row }" slot="action">
            <div class="Url-actions">
                <i-button type="warning" size="small" style="margin-right: 5px" @click="deleteTag(row._id)">删除</i-button>
                <i-button type="primary" size="small" style="margin-right: 5px" @click="editTag(row._id, row.name, row.classes)">编辑</i-button>
            </div>
        </template>
    </i-table>
    <br>
    <i-page :total="itemCount" :current="page" placement="top"  :page-size="page_size" :page-size-opts=[10,20,30,40,50,100] size="small" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="page_sizeChange" />

    <!-- loading-->
    <div v-if="showLoading" class="demo-spin-col" span="8">
        <i-spin fix>
            <i-icon type="ios-loading" size=18 class="demo-spin-icon-load"></i-icon>
            <div>Loading</div>
        </i-spin>
    </div>
</div>
</template>

<script>
import {
    mapState
} from 'vuex'
import titleSearch from '@/components/Article/titleSearch.vue'
// import func from '../../vue-temp/vue-editor-bridge'
// import XLSX from 'xlsx';
export default {
    name: 'Tag',
    data() {
        var global = this // 如果不这样， render 中找不到 正确的 this
        return {
            order: 1,
            tagEditShow: false,
            editClassShow: false,
            setMainClassShow: false,
            current_id: '',
            current_name: '',
            current_classes: '',
            xmetadata: {
                'title':'',
                'cover': ''
            },
            editorData: '',
            showLoading: false,
            searchItemTitle: '',
            searchItemKeyword: '',
            okData: [],
            badData: [],
            selectedItemList: [],
            classesChecked: [],
            statusChecked: [],
            coverChecked: [],
            fromChecked: [],
            dateRange: ["", ""],
            loading: false,
            itemCount: 0,
            page: 1,
            page_size: 10,
            tagList: [],
            classList: [],
            classSelect: [],
            new_classes: [],
            mainClass: '',
            isFilm: 0,
            columns1: [
                {
                    title: '序号',
                    key: 'xid',
                    width: 45,
                    align: 'center',
                    resizable: true,
                    fixed: 'left'
                },
                {
                    title: '名称',
                    key: 'name',
                    align: 'center',
                    minWidth: 150,
                    resizable: true,
                    fixed: 'left',
                    renderHeader(h) {
                        return h('span', [
                            h('span', '名称'),
                            h('i-poptip', {
                                    props: {
                                        title: "名称过滤",
                                        content: "content",
                                        placement: "right-start",
                                        transfer: true,
                                        trigger: 'click',
                                        closable: true,
                                        width: 450,
                                        'word-wrap': true
                                    },
                                    //style:{ 'margin-left':'5px', 'color':'#057009', 'cursor':'pointer'}
                                    style: {
                                        'margin-left': '5px',
                                        'color': (() => {
                                            if (global.searchItemTitle) {
                                                return '#2d8cf0'
                                            } else {
                                                return '#c5c8ce'
                                            }
                                        })(),
                                        'cursor': 'pointer'
                                    }
                                },
                                [h('i-icon', {
                                        props: {
                                            type: 'md-search',
                                            size: 20,
                                        }
                                    }),
                                    h(titleSearch, {
                                        slot: "content",
                                        props: {
                                            xItem: 'name'
                                        },
                                        on: {
                                            'single-search': (item) => {
                                                // console.log(data)
                                                global.searchItemTitle = item
                                                global.singleSearch(item)

                                            },
                                            'sync-query-title': (data) => {
                                                global.searchItemTitle = data
                                            },
                                            'batch-search-title': (urlItem) => {
                                                //console.log('vvv',urlItem)
                                                global.searchItemTitle = urlItem
                                                global.batchSearch()
                                            },
                                            'reset-input-title': () => {
                                                global.resetInput('name')
                                            }
                                        }
                                    })
                                ]
                            )
                        ])
                    }
                },
                {
                    title: '包含文章总数',
                    key: 'article_total',
                    align: 'center',
                    resizable: true,
                    fixed: 'left'
                },
                {
                    title: '可用文章占比',
                    key: 'article_published_total',
                    align: 'center',
                    resizable: true,
                    fixed: 'left'
                },
                {
                    title: '分类',
                    key: 'classes',
                    align: 'center',
                    resizable: true,
                    filters: [],
                    filterMultiple: true,
                    filterMethod(value, row) {
                        // 现在的筛选策略: 只要是其中 包含 选择项的， 就符合要求
                        //if (row.status === value){
                        return row //什么都不做，由专门的函数进行后端筛选
                        //}
                    },                    
                },
                {
                    title: '是否在放映厅中',
                    key: 'isFilm',
                    align: 'center',
                    resizable: true
                },
                {
                    title: '操作',
                    key: 'action',
                    slot: 'action',
                    align: 'center',
                    width: 160,
                    fixed: 'right',
                    resizable: true
                }
            ],
            articlesData: []
        }
    },
    computed: {
        ...mapState(['baseurl','currentProject']),
    },
    created() {
    },
    beforeMount() {
        
    },
    mounted() {
        this.fetchAllItems() // 获取当前
        this.fetchClasses()
        console.log(this.$router.options.routes)
    },
    beforeDestroy() {
        this.$Message.destroy()
    },
    methods: {
        setMainClass: function () {
            const self = this
            let _data = {
                'name': self.mainClass,
                'project': self.currentProject
            }
            self.axios({
                    method: 'put',
                    url: self.baseurl + 'classes',
                    data: _data
                })
                .then(res => {
                    //console.log('res',res)
                    console.log(res.data.status)
                    self.$Message.success('设置成功')
                    self.setMainClassShow = false
                    // console.log('tagList',self.tagList)
                })
                .catch(err => {
                    console.log(err)
                    self.$Message.error('设置失败')
                    self.setMainClassShow = false
                    // self.$Message.error(err.response.data.detail);
                })
        },
        submit: function () {
            const self = this
            console.log(self.current_classes, self.current_name, self.current_id)
            let _data = {
                'project': self.currentProject,
                '_id': self.current_id,
                'name': self.current_name,
                'class': self.current_classes.join(','),
                'isFilm': self.isFilm
            }
            if (this.current_stat == 'edit') {
                self.axios({
                    method: 'put',
                    url: self.baseurl + 'tags',
                    data: _data
                })
                .then(res => {
                    //console.log('res',res)
                    console.log(res.data.status)
                    self.$Message.success('修改成功')
                    self.fetchAllItems()
                    self.tagEditShow = false
                    // console.log('tagList',self.tagList)
                })
                .catch(err => {
                    console.log(err)
                    self.$Message.error('修改失败')
                    self.tagEditShow = false
                    // self.$Message.error(err.response.data.detail);
                })
            } else {
                self.axios({
                    method: 'post',
                    url: self.baseurl + 'tags',
                    data: _data
                })
                .then(res => {
                    //console.log('res',res)
                    console.log(res.data.status)
                    self.$Message.success('添加成功')
                    self.fetchAllItems()
                    self.tagEditShow = false
                    // console.log('tagList',self.tagList)
                })
                .catch(err => {
                    console.log(err)
                    self.$Message.error('添加失败')
                    self.tagEditShow = false
                    // self.$Message.error(err.response.data.detail);
                })
            }
            
        },
        addTagShow: function () {
            const self = this
            self.current_name = ''
            self.current_classes = []
            self.current_stat = 'add'
            self.tagEditShow = true
        },
        submitClass: function () {
            const self = this
            let allClasses = self.new_classes
            let _data = {
                'classes': allClasses.join(','),
                'project': self.currentProject
            }
            self.axios({
                    method: 'post',
                    url: self.baseurl + 'classes',
                    data: _data
                })
                .then(res => {
                    //console.log('res',res)
                    console.log(res.data.status)
                    self.$Message.success('修改成功')
                    self.fetchClasses()
                    self.editClassShow = false
                    // console.log('tagList',self.tagList)
                })
                .catch(err => {
                    console.log(err)
                    self.$Message.error('修改失败')
                    self.editClassShow = false
                    // self.$Message.error(err.response.data.detail);
                })
        },
        handleSort: function (column){
            // console.log('column',column)
            let self = this
            if (column.order === 'desc'){
                self.order = -1
            } else {
                self.order = 1
            }

            let dateFilter = ''
            let tagFilter = ''
            let statusFilter = ''

            if (JSON.stringify(self.dateRange) === '["",""]'){
                dateFilter = ''
            }else{
                dateFilter = self.dateRange.join(',')
            }

            if (self.tagsChecked.length === 0){
                tagFilter = ''
            } else{
                tagFilter = self.tagsChecked.join(',')   
            }

            if (self.statusChecked.length === 0){
                statusFilter = ''
            } else{
                statusFilter = self.statusChecked.join(',')   
            }

            let Params = {
                'page': self.page,
                'page_size': self.page_size,
                'statusFilter': statusFilter,
                'dateFilter': dateFilter,
                'idFilter': '',
                'titleFilter': self.searchItemTitle.toLowerCase(),
                'project': self.currentProject,
                'keywordFilter': self.searchItemKeyword.toLowerCase(),
                'tagFilter': tagFilter,
                'order': self.order
            }

            self.fetchItems(Params)
            
        },
        fetchClasses: function () {
            // 获取所有的标签
            let self = this
            let _data = {
                project: self.currentProject
            }
            self.axios({
                    method: 'get',
                    url: self.baseurl + 'classes',
                    params: _data
                })
                .then(res => {
                    //console.log('res',res)
                    let temp = [], tempL = []
                    
                    for (let ele in res.data.classes) {
                        temp.push({
                            'label': res.data.classes[ele].name,
                            'value': res.data.classes[ele].name
                        })
                        tempL.push(res.data.classes[ele].name)
                        if (res.data.classes[ele].main == true) {
                            self.mainClass = res.data.classes[ele].name
                        }
                    }
                    self.classList = temp
                    self.new_classes = tempL
                    self.classSelect = tempL
                    self.columns1[4].filters = self.classList // 必须要设置一下 ，目录列表
                    // console.log('tagList',self.tagList)
                })
                .catch(() => {
                    //console.log(err)
                    // self.$Message.error(err.response.data.detail);
                })
        },
        editTag: function (_id, name, classes) {
            const self = this
            self.tagEditShow = true
            self.current_id = _id
            self.current_name = name
            self.current_classes = classes
            self.current_stat = 'edit'
        },
        deleteTag: function (_id) {
            const self = this
            let _data = {
                project: self.currentProject,
                _id: _id
            }
            self.axios({
                    method: 'delete',
                    url: self.baseurl + 'tags',
                    data: _data
                })
                .then(res => {
                    console.log('res',res)
                    self.$Message.success('删除成功')
                    this.fetchAllItems()
                    // console.log('tagList',self.tagList)
                })
                .catch(err => {
                    console.log(err)
                    self.$Message.error(err.response.data.detail);
                })
        },
        handleOtherclick: function (e) {
            // 让下拉框， 在页面其他地方被点击的时候，消失
            if (this.$refs.urlInputOptions.contains(e.target)) {
                return
            } 
        },
        // 日历相关
        TimeChange: function (daterange) {
            let self = this
            console.log('time changed')
            // console.log(daterange)
            self.dateRange = daterange

            let dateFilter = ''
            let tagFilter = ''
            let statusFilter = ''
            let coverFilter = ''
            let fromFilter = ''

            if (JSON.stringify(self.dateRange) === '["",""]'){
                dateFilter = ''
            }else{
                dateFilter = self.dateRange.join(',')
            }

            if (self.tagsChecked.length === 0){
                tagFilter = ''
            } else{
                tagFilter = self.tagsChecked.join(',')   
            }

            if (self.statusChecked.length === 0){
                statusFilter = ''
            } else{
                statusFilter = self.statusChecked.join(',')   
            }

            if (self.coverChecked.length === 0){
                coverFilter = ''
            } else{
                coverFilter = self.coverChecked.join(',')   
            }

            if (self.fromChecked.length === 0){
                fromFilter = ''
            } else{
                fromFilter = self.fromChecked.join(',')   
            }

            let Params = {
                'page': self.page,
                'page_size': self.page_size,
                'statusFilter': statusFilter,
                'dateFilter': dateFilter,
                'idFilter': '',
                'titleFilter': self.searchItemTitle.toLowerCase(),
                'project': self.currentProject,
                'keywordFilter': self.searchItemKeyword.toLowerCase(),
                'tagFilter': tagFilter,
                'order': self.order,
                'coverFilter': coverFilter,
                'fromFilter': fromFilter,
            }

            self.fetchItems(Params)
        },
        resetInput: function (type) {
            let self = this
            console.log('reset input')
            if (type === 'title'){
                self.searchItemTitle = ''
            } else{
                self.searchItemKeyword = ''
            }
            self.fetchAllItems()
        },

        handleFilter: function (column) {
            // 处理 分类 和 状态 筛选 ,帅选重置 的时候 也是这个 函数
            // console.log(column)
            let self = this
            let chekced = {
                'key': column['key'],
                'checked': column['_filterChecked']
            }
            if (chekced.key === 'classes') {
                self.classesChecked = chekced['checked']
            } else if (chekced.key === 'status') {
                self.statusChecked = chekced['checked']
            } else if (chekced.key === 'cover') {
                self.coverChecked = chekced['checked']
            } else if (chekced.key === 'from') {
                self.fromChecked = chekced['checked']
            }
            // console.log( self.statusChecked, self.tagsChecked)

            //重新筛选，激发重新搜索  ，包含 状态 和 分类. 此时 包含的查询参数  必须有: page, page_size, 可能有: titlePart,tagsFilter ,statusFilter
            
            self.page = 1

            let dateFilter = ''
            let classFilter = ''
            let statusFilter = ''
            let coverFilter = ''
            let fromFilter = ''

            if (JSON.stringify(self.dateRange) === '["",""]'){
                dateFilter = ''
            }else{
                dateFilter = self.dateRange.join(',')
            }

            if (self.classesChecked.length === 0){
                classFilter = ''
            } else{
                classFilter = self.classesChecked.join(',')   
            }

            if (self.statusChecked.length === 0){
                statusFilter = ''
            } else{
                statusFilter = self.statusChecked.join(',')   
            }

            if (self.coverChecked.length === 0){
                coverFilter = ''
            } else{
                coverFilter = self.coverChecked.join(',')   
            }

            if (self.fromChecked.length === 0){
                fromFilter = ''
            } else{
                fromFilter = self.fromChecked.join(',')   
            }

            let Params = {
                'page': self.page,
                'page_size': self.page_size,
                'statusFilter': statusFilter,
                'dateFilter': dateFilter,
                'idFilter': '',
                'titleFilter': self.searchItemTitle.toLowerCase(),
                'project': self.currentProject,
                'keywordFilter': self.searchItemKeyword.toLowerCase(),
                'classFilter': classFilter,
                'order': self.order,
                'coverFilter': coverFilter,
                'fromFilter': fromFilter,
            }
            self.fetchItems(Params)

        },
        singleSearch: function (item) {
            // search item with specifif uid ,so only one will return
            let self = this
            console.log('singleSearch')
            //self.searchItemTitle = item.
            //console.log('uid', item['_id']['$oid'])
            //console.log('searchItemTitle', self.searchItemTitle)
            // 当进行 single search的时候，因为只关注一条记录，所以，其他筛选项是被忽略的，将他们重设为默认值。
            self.page = 1
            let Params = {
                'page': self.page,
                'page_size': self.page_size,
                'idFilter': item
            }
            self.fetchItems(Params)
            //self.searchItemTitle = '' // 恢复
        },

        batchSearch: function () {
            // 输入特定查询，按下回车键或 搜索按钮时 ，触发，会返回所有符合条件的项目 或为空
            let self = this
            console.log('batchSearch')
            
            // 下面进行 batchSearch
            let dateFilter = ''
            let tagFilter = ''
            let statusFilter = ''
            if (JSON.stringify(self.dateRange) === '["",""]'){
                dateFilter = ''
            }else{
                dateFilter = self.dateRange.join(',')
            }

            if (self.tagsChecked.length === 0){
                tagFilter = ''
            } else{
                tagFilter = self.tagsChecked.join(',')   
            }

            if (self.statusChecked.length === 0){
                statusFilter = ''
            } else{
                statusFilter = self.statusChecked.join(',')   
            }

            self.page = 1
            let Params = {
                'page': self.page,
                'page_size': self.page_size,
                'dateFilter': dateFilter,
                'idFilter': '',
                'titleFilter': self.searchItemTitle.toLowerCase(),
                'project': self.currentProject,
                'keywordFilter': self.searchItemKeyword.toLowerCase(),
                'tagFilter': tagFilter,
                'statusFilter': statusFilter,
                'order': self.order
            }
            //console.log(Params)
            self.fetchItems(Params)

        },
        fetchAllItems: function () {
            let self = this
            // let Params = {'page':self.page,'page_size':self.page_size}
            let Params = {
                'page': self.page,
                'page_size': self.page_size,
                'titleFilter': self.searchItemTitle.toLowerCase(),
                'project': self.currentProject,
                'keywordFilter': self.searchItemKeyword.toLowerCase(),
                'tagFilter': '',
                'order': self.order
            }
            self.fetchItems(Params)

        },

        fetchItems: function (getParams) {
            let self = this
            let Params = getParams
            self.loading = true
            //console.log('Params',Params)
            self.axios({
                    method: 'get',
                    url: self.baseurl + 'tags',
                    params: Params
                })
                .then(res => {
                    //console.log(res)
                    // self.page = 1
                    if (res.data.total !== '') {
                        self.itemCount = res.data.total
                    }
                    let temp = res.data.data
                    let begin = (self.page -1) * self.page_size
                    for (let ele in temp){
                        temp[ele]['xid'] = begin + parseInt(ele) + 1
                        if (temp[ele]['publish']) {
                            temp[ele]['publish'] = new Date(temp[ele]['publish']*1000).toLocaleDateString()
                        }
                    }
                    self.articlesData = temp
                    self.loading = false
                })
                .catch(() => {
                    self.loading = false
                    //console.log(err)
                    // self.$Message.error(err.response.data.detail);
                })
        },
        pageChange: function (pageIndex) {
            // console.log(pageIndex)
            let self = this
            self.page = pageIndex

            let dateFilter = ''
            let tagFilter = ''
            let statusFilter = ''
            if (JSON.stringify(self.dateRange) === '["",""]'){
                dateFilter = ''
            }else{
                dateFilter = self.dateRange.join(',')
            }

            if (self.tagsChecked.length === 0){
                tagFilter = ''
            } else{
                tagFilter = self.tagsChecked.join(',')   
            }

            if (self.statusChecked.length === 0){
                statusFilter = ''
            } else{
                statusFilter = self.statusChecked.join(',')   
            }

            let Params = {
                'page': self.page,
                'page_size': self.page_size,
                'dateFilter': dateFilter,
                'idFilter': '',
                'titleFilter': self.searchItemTitle.toLowerCase(),
                'project': self.currentProject,
                'keywordFilter': self.searchItemKeyword.toLowerCase(),
                'tagFilter': tagFilter,
                'statusFilter': statusFilter,
                'order': self.order
            }

            self.fetchItems(Params)

        },
        page_sizeChange: function (page_size) {
            let self = this
            self.page_size = page_size
            self.page = 1
            self.fetchAllItems()
        },
    }
}
</script>

<style scoped>
.Url {
    margin: 5px;
    overflow: auto !important
}

.Url-actions {
    display: flex;
    justify-content: center
}

>>>.ivu-table th {
    background: #fff;
    border-bottom: 10px solid #e8eaec;
}

>>>.ivu-table-cell {
    padding: 5px !important
}

.Url>>>.ivu-input-group .ivu-input {}

.Url-table {
    font-weight: 450;
    overflow: auto
}

.url-url-select-date {
    display: flex;
    align-items: center
}

.url-url-select {
    display: inline-block;
}

.url-label {
    border: 1px solid #dcdee2;
    padding: 2px 3px;
    height: 32px;
    text-align: center;
    border-radius: 4px
}

.url-select-option.url-select-option {
    min-width: 156px;
    position: absolute;
    will-change: top, left;
    transform-origin: center top;
    top: 32px;
    left: 0px;
}

.ivu-icon.ivu-icon-ios-calendar-outline {
    padding-top: 32px
}

.url-p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
    background-color: #e0e0e0
}

.url-p21,
.url-p22,
.url-p23,
.url-p24 {
    margin: 0 2px;
}
</style>
