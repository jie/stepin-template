import http from './http';
import axios, { AxiosPromise, Method } from 'axios'
import type { AxiosRequestConfig } from 'axios'
const oss_server_uri: string = import.meta.env.VITE_OSS_SERVER_URI as string
const api_host: string = import.meta.env.VITE_QYWX_API_HOST as string
import { useLoadingStore } from '@/store';
import { toRaw } from 'vue';

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

export const ossUploadFiles = async (e, options = {}) => {
  console.log('options:', toRaw(options))
  const { setPageLoading } = useLoadingStore();
  setPageLoading(true)
  let images = []
  const appname: string = import.meta.env.VITE_APP_NAME as string
  try {
    for (let file of e.target.files) {
      let targetFile = file
      let policyParams = {
        name: appname,
        filename: targetFile.name,
      }


      // if targetFile's width large than options.max_width then resize to options.max_width
      if (options.max_width) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const image = new Image()
        image.src = URL.createObjectURL(targetFile)
        await new Promise((resolve, reject) => {
          image.onload = () => {
            let width, height
            if (image.width > image.height && image.width > options.max_width) {
              width = options.max_width
              height = width * image.height / image.width
            } else if (image.height > image.width && image.height > options.max_width) {
              height = options.max_width
              width = height * image.width / image.height
            }
            if(width && height) {
              canvas.width = width
              canvas.height = height
              ctx.drawImage(image, 0, 0, width, height)
              canvas.toBlob((blob) => {
                targetFile = new File([blob], targetFile.name, { type: targetFile.type })
                resolve()
              }, targetFile.type)
            } else {
              resolve()
            }
          }
        })
      }

      if (options.prefix) {
        policyParams['prefix'] = options.prefix
      }
      console.log('policyParams:', policyParams)
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
      formData.append('file', targetFile)
      let uploadResult = await uploadFile(formData)
      console.log("uploadResult:", uploadResult)
      if (uploadResult?.data?.status && uploadResult?.data?.data?.url) {
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


