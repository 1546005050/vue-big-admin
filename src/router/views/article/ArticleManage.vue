<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from '@/router/views/article/components/ChannelSelect.vue'
import { artgetListChannelservece } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'
const aticleList = ref([])//列表
const total = ref(0)//总条数
const loading = ref(false)

// 定义请求参数对象
const params = ref({
    pagenum: 1,//当前页
    pagesize: 5,//当前生效的每条页数
    cate_id: '',
    state: ''
})

// 基于params获取文章列表
const getArticleList = async () => {
    loading.value = true
    const res = await artgetListChannelservece(params.value)
    aticleList.value = res.data.data
    total.value = res.data.total
    loading.value = false
}
getArticleList()

// 分页
const onSizeChange = (size) => {
    params.value.pagenum = 1
    params.value.pagesize = size
    getArticleList()
}
const onCurrentChange = (page) => {
    params.value.pagenum = page
    getArticleList()
}


const onEditArtick = (row) => {
    articleEditRef.value.open(row)

}


const onDeleteArtick = (row) => {
    console.log(row);

}

const search = () => {
    params.value.pagenum = 1
    getArticleList()
}

const reset = () => {
    params.value.pagenum = 1
    params.value.cate_id = ''
    params.value.state = ''
    getArticleList()
}

const articleEditRef = ref()

const addArticle = () => {
    articleEditRef.value.open({})
}
// <!-- 添加编辑成功 -->
const onSuccess = (type) => {
    if (type === 'add') {
        // 如果添加渲染最后一页
        const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
        params.value.pagenum = lastPage
        //  更新成最大页码
        getArticleList()
    } else {
        // 编辑渲染当前页
        getArticleList()
    }

}
</script>



<template>
    <page-container title="文章管理">
        <template #extra>
            <el-button type="primary" @click="addArticle">发布文章</el-button>
        </template>
        <!-- 表单区域 -->
        <el-form inline>
            <!-- label 展示给用户看的 value 最终提交给后台的 -->
            <el-form-item label="文章分类:">
                <channel-select v-model="params.cate_id" style="width: 240px"></channel-select>
            </el-form-item>
            <!-- 这里后台标记发布状态，通过中文标记的，已发布、草稿-->
            <el-form-item label="发布状态：">
                <el-select v-model="params.state" style="width: 240px">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="search" type="primary">搜索</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格区域 -->
        <el-table :data="aticleList" v-loading="loading">
            <el-table-column label="文章标题" prop="title">
                <template #default="{ row }">
                    <el-link type="primary" :underline="false">{{ row.title }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="分类" prop="cate_name"></el-table-column>
            <el-table-column label="发布时间" prop="pub_date">
                <template #default="{ row }">
                    {{ formatTime(row.pub_date) }}
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <!-- 利用作用域插槽 row 可获取当前的数据 => v-for 遍历item -->
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button type="primary" round small plain :icon="Edit" @click="onEditArtick(row)"></el-button>
                    <el-button type="danger" round small plain :icon="Delete" @click="onDeleteArtick(row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination v-model:current-page="params.pagenum" v-model:page-size="params.pagesize"
            :page-sizes="[2, 5, 6, 8]" :background="true" layout="jumper,total, sizes, prev, pager, next" :total="total"
            @size-change="onSizeChange" @current-change="onCurrentChange"
            style="margin-top: 20px; justify-content: flex-end" />
        <!-- 添加抽屉 -->
        <article-edit @success="onSuccess" ref="articleEditRef"></article-edit>
    </page-container>
</template>