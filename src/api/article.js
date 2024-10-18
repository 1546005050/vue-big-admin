import request from '@/utils/request'
// 分类相关
// 获取
export const articleChannelServce =()=>request.get('/my/cate/list')
// 添加
export const artAddChannelservece =(data)=>request.post('/my/cate/add',data)
// 编辑
export const artEditChannelServece =(data)=>request.put('/my/cate/info',data)
// 删除
export const artDelChannelServece= (id)=>request.delete('/my/cate/del',{params:{id}})
// 文章相关
// 获取
export const artgetListChannelservece=(params)=>request.get('/my/article/list',{params})
// 添加
export const artAddService = (data) =>request.post('/my/article/add',data)
// 获取详情
export const artGetDetailService = (id) =>request.get('my/article/info', { params: { id } })
// 更新
export const artEditServce = (data) => request.put('/my/article/info',data)
