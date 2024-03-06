import Dexie, { Table } from 'dexie';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

export interface LocalTemplate {
    id?: string;
    name?: string;
    title?: string;
    summary?: string;
    status?: string;
    create_at?: string;
    create_by?: object;
    update_at?: string;
    update_by?: object;
    settings?: object;
    items?: Array<any>;
}


interface LocalCategory {
    id?: string;
    name?: string;
}

export interface LocalReport {
    id?: string;
    name?: string;
    title?:string;
    summary?:string;
    inspect_date?: string;
    status?: string;
    category?: LocalCategory;
    schema?:Array<any>;
    items?:Array<any>;
    values?:string;
    create_at?: string;
    create_by?: object;
    update_at?: string;
    update_by?: object;
}



export class TemplateDatabase extends Dexie {
    public templates!: Table<LocalTemplate, string>; // id is number in this case
    public constructor() {
        super("TemplateDatabase");
        this.version(1).stores({
            templates: "id, name, title, summary, status, create_at, create_by, settings, items",
        });
    }
    // template
    public async createRecord(record: LocalTemplate) {
        if (!record.id) {
            record.id = nanoid();
        }
        await this.templates.add(record);
        return record.id;
    }

    public async deleteRecord(id: string) {
        await this.templates.delete(id);
    }

    public async updateRecord(record: LocalTemplate) {
        await this.templates.update(record.id, record);
    }

    public getRecord(id: string) {
        return this.templates.get({ id: id });
    }

    public queryRecord(args: any) {
        return this.templates.where(args);
    }

    public async paginate(page: number, pageSize: number, args: any = {}) {
        if (args && args.key) {
            let total = await this.templates.where(args.key).startsWith(args.value).count()
            if(total === 0) return Promise.resolve({total: 0, data: []})
            console.log(total, page, pageSize, args.key, args.value)
            let data = await this.templates
                .where(args.key).startsWith(args.value)
                .offset((page - 1) * pageSize)
                .limit(pageSize)
                .toArray()
            console.log('data:', data)
            return {
                total: total,
                data: data
            }
        } else {
            let total = await this.templates.count()
            let data = await this.templates
                .offset((page - 1) * pageSize)
                .limit(pageSize)
                .toArray()
            return {
                total: total,
                data: data
            }
        }
    }
}




export class ReportDatabase extends Dexie {
    public reports!: Table<LocalReport, string>; // id is number in this case
    public constructor() {
        super("ReportDatabase");
        this.version(1).stores({
            reports: "id, name, title, summary, category, schema, items, values, inspect_date, status, create_at, create_by"
        });
    }
    // template
    public async createRecord(record: LocalReport) {
        if (!record.id) {
            record.id = nanoid();
        }
        record.update_at = dayjs().format('YYYY-MM-DD HH:mm:ss')
        record.create_at = record.update_at 
        await this.reports.add(record);
        return record.id;
    }

    public async deleteRecord(id: string) {
        await this.reports.delete(id);
    }

    public async updateRecord(record: LocalReport) {
        record.update_at = dayjs().format('YYYY-MM-DD HH:mm:ss')
        await this.reports.update(record.id, record);
    }

    public getRecord(id: string) {
        return this.reports.get({ id: id });
    }

    public queryRecord(args: any) {
        return this.reports.where(args);
    }

    public async paginate(page: number, pageSize: number, args: any = {}) {
        if (args && args.key) {
            let total = await this.reports.where(args.key).startsWith(args.value).count()
            if(total === 0) return Promise.resolve({total: 0, data: []})
            console.log(total, page, pageSize, args.key, args.value)
            let data = await this.reports
                .where(args.key).startsWith(args.value)
                .offset((page - 1) * pageSize)
                .limit(pageSize)
                .toArray()
            console.log('data:', data)
            return {
                total: total,
                data: data
            }
        } else {
            let total = await this.reports.count()
            let data = await this.reports
                .offset((page - 1) * pageSize)
                .limit(pageSize)
                .toArray()
            return {
                total: total,
                data: data
            }
        }
    }
}


export const templateDatabase = new TemplateDatabase();
export const reportDatabase = new ReportDatabase()