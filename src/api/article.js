import requset from '@/utils/request'
// 分类相关
// 获取
export const articleChannelServce =()=>requset.get('/my/cate/list')
// 添加
export const artAddChannelservece =(data)=>requset.post('/my/cate/add',data)
// 编辑
export const artEditChannelServece =(data)=>requset.put('/my/cate/info',data)
// 删除
export const artDelChannelServece= (id)=>requset.delete('/my/cate/del',{params:{id}})
// 文章相关
// 获取
export const artgetListChannelservece=(params)=>requset.get('/my/article/list',{
    params
})