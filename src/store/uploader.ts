import http from './http';
import axios, { AxiosPromise, Method } from 'axios'
import type { AxiosRequestConfig } from 'axios'
const oss_server_uri: string = import.meta.env.VITE_OSS_SERVER_URI as string
const api_host: string = import.meta.env.VITE_QYWX_API_HOST as string
import { useLoadingStore } from '@/store';

export function getOssPolicy(data) {
  return http
    .request(`${api_host}/platform/api/oss/get_policy`, 'post_json', data, {})
    .then((response) => {
      return response.data;
    })
    .finally();
}


export function uploadFile(data) {
  return axios.post(
    oss_server_uri,
    data,
    {
      headers: {
        // 'Content-Type': 'multipart/form-data'
        'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime(),
      },
      // transformRequest: [
      //   function (data) {
      //     return data
      //   },
      // ],
    }
  )
}

export const ossUploadFiles = async (e, prefix="") => {
  const { setPageLoading } = useLoadingStore();
  setPageLoading(true)
  let images = []
  const appname: string = import.meta.env.VITE_APP_NAME as string
  try {
    for (let file of e.target.files) {
      let policyParams = {
        name: appname,
        filename: file.name,
      }
      if(prefix) {
        policyParams['prefix'] = prefix
      }
      console.log(policyParams)
      // 得到阿里云oss参数
      let policyResult = await getOssPolicy(policyParams)
      let upload_params = policyResult.data.upload_params
      console.log(upload_params)
      let formData = new FormData()
      formData.append('callback', upload_params.callback)
      formData.append('key', upload_params.key)
      formData.append('policy', upload_params.policy)
      formData.append('OSSAccessKeyId', upload_params.OSSAccessKeyId)
      formData.append('signature', upload_params.signature)
      formData.append('success_action_status', '200')
      formData.append('file', file)
      let uploadResult = await uploadFile(formData)
      console.log("uploadResult:", uploadResult)
      if(uploadResult?.data?.status && uploadResult?.data?.data?.url) {
        images.push(uploadResult?.data?.data?.url)
      }
    }
  } catch (e) {
    console.error(e)
  } finally {
    setPageLoading(false)
  }
  return images
}


