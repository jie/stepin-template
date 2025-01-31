
/**
 * 初始化目标值为 undefined 的属性
 * @param target 目标对象
 * @param dft 默认值对象
 */
export function initUndefined<T extends Record<string, any>, K extends keyof T>(target: T, dft: Required<Pick<T, K>>) {
  (Object.keys(dft) as K[]).forEach((key) => (target[key] = target[key] ?? dft[key]));
}


export const openNewUrl = (router: any, params: object) => {
  let url = router.resolve(params)
  console.log(`/${url.href}`)
  if (url.href.startsWith('/report_system')) {
    window.open(`${url.href}`, '_blank')
  } else {
    window.open(`/report_system${url.href}`, '_blank')
  }
}


export const displayReportCategory = (report: any, locale: string) => {
  if (report.is_thirdparty) {
    if (locale == 'en') {
      return report.order_data.category.name_en || report.order_data.category.name
    } else {
      return report.order_data.category.name
    }
  } else {
    if (locale == 'en') {
      return report.category.name_en || report.category.name
    } else {
      return report.category.name
    }
  }
}

export const displayCompanyName = (report: any, locale: string) => {
  if (report.is_thirdparty) {
    if (locale == 'en') {
      return report.order_data.company.name_en || report.order_data.company.shortname || report.order_data.company.name
    } else {
      return report.order_data.company.shortname || report.order_data.company.name
    }
  } else {
    if (locale == 'en') {
      return report.company.name_en || report.company.shortname || report.company.name
    } else {
      return report.company.shortname || report.company.name
    }
  }
}

export const copyJson = (obj, k, v) => {
  let data = JSON.parse(JSON.stringify(obj))
  data[k] = v
  return data
}

export const newJsonObject = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 根据oldValue更新节点
export const updateNodeLabel = (treeData:any, oldValue:string, newObj:object) => {
  for (let node of treeData) {
      if (node.value === oldValue) {
          for(let key of Object.keys(newObj)) {
            node[key] = newObj[key]
          }
          break
      }

      if (node.children) {
          updateNodeLabel(node.children, oldValue, newObj);
      }
  }
}

// 找到等于value的节点
export const findNodeLabel = (treeData: any, value: string) => {
  for (let node of treeData) {
      if (node.value === value) {
          return node
      }

      if (node.children) {
          const foundNode = findNodeLabel(node.children, value);
          // 如果在子节点中找到了匹配的节点，返回该节点
          if (foundNode) {
              return foundNode;
          }
      }
  }
}

// 删除等于value的节点
export const deleteNode = (treeData: any, value: string) => {
  for (let node of treeData) {
      if (node.value === value) {
          treeData.splice(treeData.indexOf(node), 1)
          break
      }

      if (node.children) {
          deleteNode(node.children, value);
      }
  }
}

// 找到等于value的节点，并将该节点和前一个节点交换位置
export const moveUpNode = (treeData: any, value: string) => {
  for (let i = 0; i < treeData.length; i++) {
      if (treeData[i].value === value && i > 0) {
          let temp = treeData[i]
          treeData[i] = treeData[i - 1]
          treeData[i - 1] = temp
          break
      }

      if (treeData[i].children) {
          moveUpNode(treeData[i].children, value);
      }
  }
}

// 找到等于value的节点，并将该节点和后一个节点交换位置
export const moveDownNode = (treeData: any, value: string) => {
  for (let i = 0; i < treeData.length; i++) {
      if (treeData[i].value === value && i < treeData.length - 1) {
          let temp = treeData[i]
          treeData[i] = treeData[i + 1]
          treeData[i + 1] = temp
          break
      }

      if (treeData[i].children) {
          moveDownNode(treeData[i].children, value);
      }
  }
}

// 找到没有children或者children为空数组的节点
export const findLeafNode = (treeData: any) => {
  let leafNodes = []
  for (let node of treeData) {
      if (!node.children || node.children.length === 0) {
          leafNodes.push(node)
      } else {
          leafNodes = leafNodes.concat(findLeafNode(node.children))
      }
  }
  return leafNodes
}

export const statusColorMap = {
  "conformed": "green",
  "not_conformed": "volcano",
  "not_applicable": "red",
  "pending": "purple",
}


export const getStatusLabelColor = (fields: any) => {
  let status = "cyan"
  for (let field of fields) {
    if (field.value === 'status') {
      if (field.data == "conformed") {
        status = "green"
      } else if (field.data == "not_conformed") {
        status = "volcano"
      } else if (field.data == "not_applicable") {
        status = "red"
      } else if (field.data == "pending") {
        status = "purple"
      }
    }
  }
  return status
}

