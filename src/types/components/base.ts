
import { nanoid } from "nanoid";

export type ComponentType = {
  title: string;
  type: string;
  required: boolean;
  icon?: string;
  key: string;
  sort: string;
  summary?: string;
  desc?: string;
  data?: any;
  defaultData?: any;
  // selection
}

export type SelectionComponentType = ComponentType & {
  options?: Option[];
  maxCount?: number;
  minCount?: number;
  multiple?: boolean;
}

export type UploadComponentType = ComponentType & {
  maxCount?: number;
  minCount?: number;
  columns?: number; // 渲染几列
}

export class BaseComponent  {
  title: string;
  type: string;
  required: boolean;
  icon?: string;
  key: string;
  sort: string;
  summary?: string;
  desc?: string;
  data?: any;
  defaultData?: any;
  // selection
  options?: Option[];
  maxCount?: number;
  minCount?: number;
  multiple?: boolean;
  // columns
  columns?: number;
  constructor(componentData: ComponentType) {
    this.title = componentData.title;
    this.type = componentData.type;
    this.required = componentData.required;
    this.icon = componentData.icon;
    this.key = componentData.key || nanoid();
    this.sort = componentData.sort;
    this.summary = componentData.summary;
    this.desc = componentData.desc;
    this.data = componentData.data;
    this.defaultData = componentData.defaultData;
  }
  initialize() {
  }
  generateKey() {
    this.key = nanoid();
  }
  getData()  {

  }
  beforeAdd() {
    this.generateKey();
    console.log('beforeAdd', this.key)
  }
  afterAdd(){
    
  }
  beforeDel(){
    
  }
  afterDel(){
    
  }
  // create a object method

}


export type Option = {
  label?: string
  summary?: string
  value?: string
}

export type validateResult = {
  status?:boolean
  msg?: string
}

export interface SelectionInterface {
  options?: Option[];
  maxCount?: number;
  minCount?: number;
  multiple?: boolean;
  validate(): validateResult;
}

export class SelectionComponent extends BaseComponent implements SelectionInterface  {

  constructor(componentData: SelectionComponentType) {
    super(componentData);
    this.options = componentData.options;
    this.maxCount = componentData.maxCount;
    this.minCount = componentData.minCount;
    this.multiple = componentData.multiple;
  }

  validate(): validateResult {
    if(this.maxCount != 0 && this?.data.length > this.maxCount) {
      return {status: false, msg: 'maxCount_error'}
    }
    if(this.minCount != 0 && this?.data.length < this.minCount) {
      return {status: false, msg: 'minCount_error'}
    }
    return {status: false, msg: 'ok'}
  }
}

export class UploadComponent extends BaseComponent {
  constructor(componentData: UploadComponentType) {
    super(componentData);
    this.maxCount = componentData.maxCount;
    this.minCount = componentData.minCount;
    this.columns = componentData.columns;
  }
}