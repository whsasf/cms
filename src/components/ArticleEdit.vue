<template>
  <i-row>
    <i-col span="18">
      <i-input v-model="title" placeholder="请输入标题">
        <span slot="prepend">标题</span>
      </i-input>
      <br />
      <i-input v-model="cover" placeholder="请输入封面链接">
        <span slot="prepend">封面</span>
      </i-input>
      <br />
      <i-select v-model="tags" filterable multiple allow-create>
        <i-option v-for="tag in allTags" :value="tag" :key="tag">{{
          tag
        }}</i-option>
      </i-select>
      <br />
      <ckeditor class="ck" v-model="content" :config="editorConfig"></ckeditor>
    </i-col>
    <i-col span="6">
      <i-row>
        <i-col span="24">
          <i-radioGroup v-model="status" vertical size="large">
            <i-radio label="待定" border>
              <span>待定</span>
            </i-radio>
            <i-radio label="已编辑" border>
              <span>已编辑</span>
            </i-radio>
            <i-radio label="已审核" border>
              <span>已审核</span>
            </i-radio>
            <i-radio label="废弃" border>
              <span>废弃</span>
            </i-radio>
          </i-radioGroup></i-col
        >
        <i-col span="24" style="margin-top: 15px">
          <label>发布日期：</label>
          <i-datePicker
            type="date"
            placeholder="请选择发布日期"
            v-model="publish"
          ></i-datePicker>
        </i-col>
        <i-col span="24" style="margin-top: 15px"
          ><i-button type="success" size="large" @click="submit"
            >提交</i-button
          ></i-col
        >
        <i-col span="24" style="margin-top: 15px">
          <i-checkboxGroup v-model="keywordSelected">
              <i-checkbox  size="large" v-for="keyword in allKeywords" :key="keyword" :label="keyword" border=true></i-checkbox>
          </i-checkboxGroup>
        </i-col>
      </i-row>
    </i-col>
  </i-row>
</template>

<script>
import { mapMutations, mapState } from "vuex";
// import currentPath from "@/components/currentPath.vue";
export default {
  name: "articleEdit",
  data() {
    return {
      content: "",
      title: "",
      cover: "",
      tags: [],
      allTags: [],
      status: "",
      publish: "",
      editorConfig: {
        // The configuration of the editor.
        height: 700,
      },
      allKeywords: [],
      keywordSelected: []
    };
  },
  computed: {
    ...mapState(["baseurl", "currentProject"]),
  },
  mounted() {
    const self = this;
    let articleId = this.$route.params.id;
    self.articleId = articleId;
    let Params = {
      idFilter: articleId,
      project: self.currentProject,
    };
    self.fetchItem(Params);
    self.getAllTags();
  },
  created() {
    this.changeCurrentProject(this.$route.params.project);
  },
  updated() {
    //console.log('upadated')
    //this.xmetadata = JSON.parse(JSON.stringify(this.title))
    //this.editorData = JSON.parse(JSON.stringify(this.editorData2))
  },
  methods: {
    ...mapMutations(['changeCurrentProject']),
    fetchItem: function (getParams) {
      let self = this;
      let Params = getParams;
      self.loading = true;
      //console.log('Params',Params)
      self
        .axios({
          method: "get",
          url: self.baseurl + "articles",
          params: Params,
        })
        .then((res) => {
          let temp = res.data.data;
          self.articleData = temp[0];
          self.content = self.articleData.content;
          self.title = self.articleData.title;
          self.cover = self.articleData.cover;
          self.tags = self.articleData.tags;
          self.status = self.articleData.status;
          let publish = '';
          if (self.articleData.publish) {
            publish = new Date(self.articleData.publish*1000)
          }
          self.publish = publish;
          self.loading = false;
          self.allKeywords = res.data.keywords
        })
        .catch(() => {
          self.loading = false;
          //console.log(err)
          // self.$Message.error(err.response.data.detail);
        });
    },
    getAllTags: function () {
      const self = this;
      let Params = {
        project: self.currentProject,
      };
      self
        .axios({
          method: "get",
          url: self.baseurl + "tags",
          params: Params,
        })
        .then((res) => {
          for (let ele in res.data.data) {
              self.allTags.push(res.data.data[ele]['name'])
          }
          self.loading = false;
        })
        .catch(() => {
          self.loading = false;
          //console.log(err)
          // self.$Message.error(err.response.data.detail);
        });
    },
    submit: function () {
      const self = this;
      let publish;
      if (self.publish) {
        publish =Date.parse(self.publish)/1000
      }
      let params = {
        project: self.currentProject,
        article_id: self.articleId,
        keywordSelected: self.keywordSelected,
        detail: {
          title: self.title,
          content: self.content,
          cover: self.cover,
          tags: JSON.parse(JSON.stringify(self.tags)),
          status: self.status,
          publish: publish,
        },
      };
      self
        .axios({
          method: "put",
          url: self.baseurl + "articles",
          data: params,
        })
        .then(() => {
          self.$Message.success("提交成功");
        })
        .catch(() => {
          self.$Message.error("提交失败");
        });
    },
  },
};
</script>
.ck { height: 800px; }
<style scoped></style>
