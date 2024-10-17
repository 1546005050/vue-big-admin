import request from '@/utils/request'
// 注册接口
export  const userRegisterService = ({username,password,repassword})=>
 request.post('/api/reg',{username,password,repassword})

export const userLoginService=({username,password})=>request.post('/api/login',{username,password})