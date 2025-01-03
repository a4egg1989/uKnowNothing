import { axiosInstanceJwt, axiosInstanceTida } from '../utils/axios.js';
import roleHelper from '../utils/role.js';

export default {
    // 登入
    async useLogin (obj) {
        try {
            const res = await axiosInstanceJwt.post('/login', obj);
            if (res === null || res.data === null) {
                return null
            }

            // 儲存 login info
            if (res.data.data) {
                const user = {
                    useid: res.data.data.userId,
                    user: res.data.data.email,
                    name: res.data.data.userName,
                    accountStatus: res.data.data.accountStatus
                }
                roleHelper.setUser(user);
            }

            return {
                isSuccess: true
            }
        } catch (error)  {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg
            }
        }
    },
    // 登出
    async logout() {
        try {
            const res = await axiosInstanceJwt.get('/logout');
            if (res === null || res.data === null) {
                return null
            }

            roleHelper.deleteRole();
            return {
                isSuccess: true,
                msg: res.data.rtnMsg
            }
            
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg
            }
        }
    },
    // 註冊
    async userReigster(obj) {
        try {
            // 性別
            obj.isMale = obj.sex === '男';
            const res = await axiosInstanceTida.post('/signup', obj);
            if (res === null || res.data === null) {
                return null
            }

            return {
                isSuccess: true,
                msg: res.data.rtnMsg
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg
            }
        }
    },
    // 註冊後信箱驗證
    async verifyEmail(verifyCode) {
        try {
            const res = await axiosInstanceJwt.post('/verify-email', { verifyCode });
            if (res === null || res.data === null) {
                return null
            }

            return {
                isSuccess: true,
                msg: res.data.rtnMsg
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg
            }
        }
    },
    // 登入後重寄信箱驗證
    async sendVerifyEmail() {
        try {
            const res = await axiosInstanceJwt.get('/resend-verify-email');
            if (res === null || res.data === null) {
                return null
            }

            return {
                isSuccess: true,
                msg: res.data.rtnMsg
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg
            }
        }
    }
}