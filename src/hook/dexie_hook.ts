import Dexie, { Table } from 'dexie';
import { nanoid } from 'nanoid';


export interface ReportTemplate {
    id?: string;
    name?: string;
    title?: string;
    summary?: string;
    status?: string;
    create_at?: string;
    create_by?: object;
    settings?: object;
    items?: Array<any>;
}

interface Company {
    id?: string;
    name?: string;
    shortname?: string;
}

interface Customer {
    id?: string;
    name?: string;
    email?: string
    mobile?: string
}

interface Worker {
    id?: string;
    name?: string;
    email?: string
    mobile?: string
}

interface Category {
    id?: string;
    name?: string;
}

export interface Report {
    id?: string;
    name?: string;
    company?: Company;
    customer?: Customer;
    workers?: Array<Worker>;
    category?: Category;
    inspect_date?: string;
    status?: string;
    create_at?: string;
    create_by?: object;
}



export class ReportDatabase extends Dexie {
    public report_templates!: Table<ReportTemplate, string>; // id is number in this case
    public report_items!: Table<Report, string>; // id is number in this case

    public constructor() {
        super("ReportDatabase");
        this.version(1).stores({
            report_templates: "id, name, title, summary, status, create_at, create_by, settings, items",
            report_items: "id, name, company, customer, workers, category, inspect_date, status, create_at, create_by"
        });
    }
    // template
    public async addReportTemplate(record: ReportTemplate) {
        if (!record.id) {
            record.id = nanoid();
        }
        await this.report_templates.add(record);
        return record.id;
    }

    public async delReportTemplate(id: string) {
        await this.report_templates.delete(id);
    }

    public async updateReportTemplate(record: ReportTemplate) {
        await this.report_templates.update(record.id, record);
    }

    public getReportTemplate(id: string) {
        return this.report_templates.get({ id: id });
    }

    public queryReportTemplate(args: any) {
        return this.report_templates.where(args);
    }

    public async paginateReportTemplate(page: number, pageSize: number, args: any = {}) {
        if (args && args.key) {
            let total = await this.report_templates.where(args.key).startsWith(args.value).count()
            if(total === 0) return Promise.resolve({total: 0, data: []})
            console.log(total, page, pageSize, args.key, args.value)
            let data = await this.report_templates
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
            let total = await this.report_templates.count()
            let data = await this.report_templates
                .offset((page - 1) * pageSize)
                .limit(pageSize)
                .toArray()
            return {
                total: total,
                data: data
            }
        }
    }
    // report
    public async addReportItem(record: Report) {
        if (!record.id) {
            record.id = nanoid();
        }
        await this.report_items.add(record);
        return record.id;
    }

    public async delReportItem(id: string) {
        await this.report_items.delete(id);
    }

    public async updateReportItem(record: Report) {
        await this.report_items.update(record.id, record);
    }

    public getReportItem(id: string) {
        return this.report_items.get({ id: id });
    }

    public queryReportItem(args: any) {
        return this.report_items.where(args);
    }

    public async paginateReportItem(page: number, pageSize: number) {
        let offset = (page - 1) * pageSize;
        let limit = pageSize;
        let total = await this.report_items.count();
        let data = await this.report_items.offset(offset).limit(limit).toArray();
        return {
            total: total,
            data: data
        }
    }
}

export const db = new ReportDatabase();