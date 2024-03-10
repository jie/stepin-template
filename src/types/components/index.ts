import { extend } from "lodash";
import { BaseComponent, SelectionComponent, UploadComponent } from "./base";
import { ReportTableColumnsType } from "./table";

export class ReportTitle extends BaseComponent {
    type = "text"
    defaultData = "Title"
}

export class ReportInput extends BaseComponent {
    type = "input"
    defaultData = ""
}

export class ReportInputGroup extends BaseComponent {
    type = "input_group"
    defaultData = ""
}

export class ReportTable extends BaseComponent {
    type = "table"
    defaultData = ""
}

export class ReportImage extends BaseComponent {
    type = "image"
    defaultData = ""
}

export class ReportImageUpload extends UploadComponent {
    type = "image_upload"
    defaultData = ""
}

export class ReportRadio extends SelectionComponent {
    type = "radio"
    defaultData = ""
}

export class ReportCheckbox extends SelectionComponent {
    type = "checkbox"
    defaultData = ""
}

export class ReportContainer extends BaseComponent {
    type = "container"
    defaultData = ""
}