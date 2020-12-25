<template>
<div class="Url">
    <i-page :total="itemCount" :current="page" placement="bottom"  :page-size="page_size" :page-size-opts=[10,20,30,40,50,100] size="small" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="page_sizeChange" />
    <i-table class="Url-table" :columns="columns1" :data="articlesData" :loading="loading" @on-selection-change="handleSelectRow()" ref="table" stripe border @on-filter-change="handleFilter" @on-sort-change="handleSort">
        <template slot-scope="{ row }" slot="action">
            <div class="Url-actions">
                <i-button type="primary" size="small" style="margin-right: 5px" @click="initCkEditor(row._id)">编辑</i-button>
            </div>
        </template>
    </i-table>
    <br>
    <i-page :total="itemCount" :current="page" placement="top"  :page-size="page_size" :page-size-opts=[10,20,30,40,50,100] size="small" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="page_sizeChange" />

    <!-- 隐藏组件在此-->
    <i-ckeditor :ckeditorShow.sync="ckeditorShow" :title="xmetadata"  :editorData2="editorData" @update-article = "updateArticle" ></i-ckeditor>
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
import ckEditor from '@/components/Article/ckEditor.vue'
import titleSearch from '@/components/Article/titleSearch.vue'
// import XLSX from 'xlsx';
export default {
    name: 'Article',
    data() {
        var global = this // 如果不这样， render 中找不到 正确的 this
        return {
            order: 1,
            ckeditorShow: false,
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
            tagsChecked: [],
            statusChecked: [],
            coverChecked: [],
            fromChecked: [],
            dateRange: ["", ""],
            loading: false,
            itemCount: 0,
            page: 1,
            page_size: 10,
            tagList: [],
            fromList: [],
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
                    title: '排名',
                    key: 'id',
                    width: 60,
                    align: 'center',
                    sortable: true,
                    resizable: true,
                    fixed: 'left'
                },
                {
                    title: '标题',
                    key: 'title',
                    align: 'center',
                    minWidth: 150,
                    resizable: true,
                    fixed: 'left',
                    renderHeader(h) {
                        return h('span', [
                            h('span', '标题'),
                            h('i-poptip', {
                                    props: {
                                        title: "标题过滤",
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
                                            xItem: 'title'
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
                                                global.resetInput('title')
                                            }
                                        }
                                    })
                                ]
                            )
                        ])
                    }
                },
                {
                    title: '关键词',
                    key: 'key',
                    align: 'center',
                    minWidth: 100,
                    resizable: true,
                    renderHeader(h) {
                        return h('span', [
                            h('span', '关键词'),
                            h('i-poptip', {
                                    props: {
                                        title: "关键词过滤",
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
                                            if (global.searchItemKeyword) {
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
                                            size: 20
                                        }
                                    }),
                                    h(titleSearch, {
                                        slot: "content",
                                        props: {
                                            xItem: 'keyword'
                                        },
                                        on: {
                                            'single-search': (item) => {
                                                // console.log(data)
                                                global.searchItemKeyword = item
                                                global.singleSearch(item)

                                            },
                                            'sync-query-keyword': (data) => {
                                                global.searchItemKeyword = data
                                            },
                                            'batch-search-keyword': (urlItem) => {
                                                //console.log('vvv',urlItem)
                                                global.searchItemKeyword = urlItem
                                                global.batchSearch()
                                            },
                                            'reset-input-keyword': () => {
                                                global.resetInput('keyword')
                                            }
                                        }
                                    })
                                ]
                            )
                        ])
                    }
                },
                {
                    title: '状态',
                    key: 'status',
                    align: 'center',
                    minWidth: 60,
                    filters: [{
                        'label': '待定',
                        'value': '待定'
                    }, {
                        'label': '已编辑',
                        'value': '已编辑'
                    }, {
                        'label': '已审核',
                        'value': '已审核'
                    }, {
                        'label': '废弃',
                        'value': '废弃'
                    } ],
                    filterMethod(value, row) {
                        // 现在的筛选策略: 只要是其中 包含 选择项的， 就符合要求
                        //if (row.status === value){
                        return row //什么都不做，由专门的函数进行后端筛选
                        //}
                    },
                    resizable: true,
                    render: (h, params) => {
                        // console.log(params)
                        if (params.row.status === '待定') {
                            return h('p', {
                                style: {
                                    'background-color': 'rgba(144, 154, 146, 0.5)',
                                }
                            }, params.row.status)
                        } else if (params.row.status === '已编辑') {
                            return h('p', {
                                style: {
                                    'background-color': 'rgba(14, 237, 66, 0.5)',
                                }
                            }, params.row.status)
                        } else if (params.row.status === '已审核') {
                            return h('p', {
                                style: {
                                    'background-color': 'rgba(14, 237, 66, 0.5)',
                                }
                            }, params.row.status)
                        } else if (params.row.status === '废弃') {
                            return h('p', {
                                style: {
                                    'background-color': 'rgb(250, 121, 94)',
                                }
                            }, params.row.status)
                        }
                    }
                },
                {
                    title: '发布时间',
                    key: 'publish',
                    align: 'center',
                    minWidth: 100,
                    resizable: true,
                    renderHeader(h) {
                        return h('span', [
                            h('span', '发布时间'),
                            h('i-poptip', {
                                    props: {
                                        title: "日期过滤",
                                        content: "content",
                                        placement: "left-start",
                                        transfer: true,
                                        trigger: 'click',
                                        width: 400
                                    },
                                    style: {
                                        'margin-left': '5px',
                                        'color': (() => {
                                            if (global.dateRange.length === 2 && global.dateRange[0] === '' && global.dateRange[1] === '') {
                                                return '#c5c8ce'
                                            } else {
                                                return '#2d8cf0'
                                            }
                                        })(),
                                        'cursor': 'pointer'
                                    }
                                },
                                [h('i-icon', {
                                        props: {
                                            type: 'ios-funnel',
                                            size: 16
                                        }
                                    }),
                                    h('i-datePicker', {
                                        slot: "content",
                                        props: {
                                            type: 'datetimerange',
                                            placeholder: '选择日期时间区间',
                                            transfer: false,
                                            format: "yyyy-MM-dd HH:mm:ss"
                                        },
                                        style: {
                                            position: 'static',
                                            width: '320px'
                                        },
                                        on: {
                                            'on-change': (daterange) => {
                                                // console.log(daterange)
                                                global.TimeChange(daterange)
                                            }
                                        }
                                    })
                                ])
                        ])
                    }
                },
                {
                    title: '标签',
                    key: 'tags',
                    align: 'center',
                    width: 60,
                    resizable: true,
                    filters: [],
                    filterMultiple: true,
                    filterMethod(value, row) {
                        // 现在的筛选策略: 只要是其中 包含 选择项的， 就符合要求
                        //if (row.status === value){
                        return row //什么都不做，由专门的函数进行后端筛选
                        //}
                    },     
                    render: (h, params) => {
                        console.log(params.row.tags,typeof(params.row.tags))
                        return params.row.tags.join(';')
                    }               
                },
                {
                    title: '来源',
                    key: 'from',
                    align: 'center',
                    width: 150,
                    resizable: true,
                    filters: [],
                    filterMultiple: true,
                    filterMethod(value, row) {
                        // 现在的筛选策略: 只要是其中 包含 选择项的， 就符合要求
                        //if (row.status === value){
                        return row //什么都不做，由专门的函数进行后端筛选
                        //}
                    }
                },
                {
                    title: '封面',
                    key: 'cover',
                    align: 'center',
                    minWidth: 120,
                    resizable: true,
                    filters: [{
                        'label': '有封面',
                        'value': '有封面'
                    }, {
                        'label': '无封面',
                        'value': '无封面'
                    }],
                    render: (h, params) => {
                        return (h('img', {
                            style: {
                                    width: "100px",
                                    verticalAlign: "middle",
                                    overflow: 'auto',
                                    'max-height': '100px'
                                },
                            attrs: {
                                src: params.row.cover
                            }
                            
                        },  ))  
                    },
                    filterMethod(value, row) {
                        return row //什么都不做，由专门的函数进行后端筛选
                    }, 
                },
                
                {
                    title: '摘要',
                    key: 'des',
                    align: 'center',
                    width: 150,
                    resizable: true
                },
                {
                    title: '作者',
                    key: 'author',
                    align: 'center',
                    width: 100,
                    resizable: true
                },
                {
                    title: '操作',
                    key: 'action',
                    slot: 'action',
                    align: 'center',
                    width: 80,
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
    components: {
        'i-ckeditor': ckEditor
    },
    beforeMount() {
        
    },
    mounted() {
        this.fetchAllItems() // 获取当前
        this.fetchTags()
        this.fetchFroms()
        console.log(this.$router.options.routes)
    },
    beforeDestroy() {
        this.$Message.destroy()
    },
    methods: {
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
        updateArticle: function (allData){
             let self = this
            
             allData['page'] = self.page,
             allData['page_size'] = self.page_size,
             allData['project'] = self.currentProject,

             self.axios({
                    method: 'put',
                    url: self.baseurl + 'articles',
                    data: allData
                })
                .then(res => {
                    //console.log('res',res)
                    if (res.data.total !== '') {
                        self.itemCount = res.data.total
                    }
                    self.articlesData = res.data.data
                    // console.log('tagList',self.tagList)
                })
                .catch(err => {
                    console.log(err)
                    // self.$Message.error(err.response.data.detail);
                })

        },
        fetchTags: function () {
            // 获取所有的标签
            let self = this
            let _data = {
                project: self.currentProject
            }
            self.axios({
                    method: 'get',
                    url: self.baseurl + 'tags',
                    params: _data
                })
                .then(res => {
                    //console.log('res',res)\
                    for (let ele in res.data.data) {
                        self.tagList.push({
                            'label': res.data.data[ele]['name'],
                            'value': res.data.data[ele]['name']
                        })
                    }
                    self.columns1[6].filters = self.tagList // 必须要设置一下 ，目录列表
                    // console.log('tagList',self.tagList)
                })
                .catch(() => {
                    //console.log(err)
                    // self.$Message.error(err.response.data.detail);
                })
        },
        fetchFroms: function () {
            // 获取所有的标签
            let self = this
            let _data = {
                project: self.currentProject
            }
            self.axios({
                    method: 'get',
                    url: self.baseurl + 'froms',
                    params: _data
                })
                .then(res => {
                    //console.log('res',res)
                    for (let ele in res.data.froms) {
                        self.fromList.push({
                            'label': res.data.froms[ele],
                            'value': res.data.froms[ele]
                        })
                    }
                    self.columns1[7].filters = self.fromList // 必须要设置一下 ，目录列表
                    // console.log('tagList',self.tagList)
                })
                .catch(() => {
                    //console.log(err)
                    // self.$Message.error(err.response.data.detail);
                })
        },
        initCkEditor: function (_id){
            this.$router.push('/Project/'+this.currentProject+'/ArticleEdit/'+_id)
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
            if (chekced.key === 'tags') {
                self.tagsChecked = chekced['checked']
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
                'dateFilter': '',
                'idFilter': '',
                'titleFilter': self.searchItemTitle.toLowerCase(),
                'project': self.currentProject,
                'keywordFilter': self.searchItemKeyword.toLowerCase(),
                'tagFilter': '',
                'statusFilter': '',
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
                    url: self.baseurl + 'articles',
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
        }
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
