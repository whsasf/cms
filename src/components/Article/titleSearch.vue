<template>
<div class="url-url-select ivu-select ivu-select-visible ivu-select-single ivu-select-default" style="position: relative">
    <i-input v-model="searchItem" :clearable="true" :autofocus="true" search placeholder="输入标题进行模糊查询" @on-change="urlSearch" @on-search="batchSearch" @on-clear="resetInput" />
    <div ref='urlInputOptions' v-show="searchResult.length !== 0" class="url-url-select-option ivu-select-dropdown" x-placement="bottom-start" style="position: relative">
        <div v-if="this.xItem === 'title'">
            <i-option  @click.native="singleSearch(item['id'])" style="text-align: left" v-for="(item,index) in searchResult" :value="index" :key="index" v-html="index + 1 + ': ' + ' -' + item.id + '- ' + item.title.replace(searchItem,'<strong>'+searchItem+'</strong>')"></i-option>
        </div>
        <div v-else>
            <i-option  @click.native="singleSearch(item['id'])" style="text-align: left" v-for="(item,index) in searchResult" :value="index" :key="index" v-html="index + 1 + ': ' + ' -' + item.id + '- ' + item.keywords.replace(searchItem,'<strong>'+searchItem+'</strong>')"></i-option>
        </div>
    </div>
</div>
</template>

<script>
import {
    mapState
} from 'vuex'
export default {
    name: 'titleSearch',
    data() {
        return {
            searchItem: '',
            searchResult: []
        }
    },
    computed: {
        ...mapState(['baseurl', 'currentProject']),
    },
    props: ['xItem'],
    methods: {
        singleSearch: function (item) {
            this.$emit('single-search', item)
        },
        resetInput: function () {
            // 内外都 reset
            this.searchItem = ''
            this.searchResult = []
            if (this.xItem === 'title'){
                this.$emit('reset-input-title')
            }else{
                this.$emit('reset-input-keyword')
            }
        },
        batchSearch: function () {

            if (this.xItem === 'title'){
                this.$emit('batch-search-title', this.searchItem)
            }else{
                this.$emit('batch-search-keyword', this.searchItem)
            }
        },
        urlSearch: function () {
            // console.log('basic words Search running ...')
            // 实时查询候选 选项
            // 选择特定条目时的动作: 进入 singleSearch
            let self = this
            let query = self.searchItem
            if (self.xItem === 'title'){
                self.$emit('sync-query-title', query)
            }else{
                self.$emit('sync-query-keyword', query)
            }
            //console.log('query',query)
            //发往后端，进行查询,如果 query 不为空 
            if (query !== '') {
                // let Params = {'urlPart':query.toLowerCase()}
                // 全部返回，所以 页面设置 为  0，0 
                let Params = ''
                if (self.xItem === 'title'){
                    Params = {
                        'titleFilter': self.searchItem.toLowerCase(),
                        'page': 1,
                        'page_size': 300, // 此处获取前300
                        'fields': 'title,id',
                        'project': self.currentProject,
                    }
                }else{
                    Params = {
                        'keywordFilter': self.searchItem.toLowerCase(),
                        'page': 1,
                        'page_size': 300, // 此处获取前300
                        'fields': 'keywords,id',
                        'project': self.currentProject,
                    }
                }
                //console.log(Params)
                self.axios({
                        method: 'get',
                        url: self.baseurl + 'articles',
                        params: Params
                    })
                    .then(res => {
                        //console.log('res9999',res)
                        self.searchResult = res.data.data
                        // console.log(self.searchResult)
                    })
                    .catch(err => {
                        console.log(err)
                        // self.$Message.error(err.response.data.detail);
                    })
            } else {
                self.searchResult = []
            }
        },
    }
}
</script>

<style scoped>
>>>.ivu-icon.ivu-icon-ios-search.ivu-input-icon.ivu-input-icon-normal.ivu-input-search-icon,
>>>.ivu-icon.ivu-icon-ios-close-circle.ivu-input-icon.ivu-input-icon-clear.ivu-input-icon-normal {
    padding-top: 16px
}

>>>.url-url-select-option.ivu-select-dropdown strong {
    background-color: yellow
}

>>>.url-url-select-option.ivu-select-dropdown {
    max-height: 400px;
    overflow: auto
}
</style>
