import { StudentAmbassador, type IStudentAmbassador } from '@/database/models';
import { BadRequestException } from '@/exceptions';
import type { INewAmbassador } from '@/interfaces/ambassadorInterface';
import { json2csv } from 'json-2-csv';
import { jsPDF as PDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { paginate, type SortOption } from '@/utils/common';

class StudentAmbassadorService {
  async checkIfAmbassadorExists(email: string): Promise<boolean> {
    const ambassador = await StudentAmbassador.findOne({ email });
    // returns boolean if ambassador exists
    return !!ambassador;
  }

  // generate pdf from data
  generatePDF = (data: Array<{ cover_letter: any[] }>): string => {
    const doc = new PDF({ orientation: 'landscape', format: 'a2' });
    const preparedData = data.map(o => ({
      ...o,
      // convert array to string
      cover_letter: o.cover_letter
        .map((o: { url: string }) => o.url)
        .join(', '),
    }));
    // add table to pdf
    autoTable(doc, {
      columns: [
        { header: 'ID', dataKey: '_id' },
        { header: 'Email', dataKey: 'email' },
        { header: 'First Name', dataKey: 'firstname' },
        { header: 'Last Name', dataKey: 'lastname' },
        { header: 'Social Media', dataKey: 'social_media' },
        { header: 'Phone', dataKey: 'phone' },
        { header: 'Institution', dataKey: 'institution' },
        { header: 'Institution State', dataKey: 'institution_state' },
        { header: 'Position', dataKey: 'position' },
        { header: 'Level', dataKey: 'level' },
        { header: 'Communities', dataKey: 'communities' },
        { header: 'Why Ambassador', dataKey: 'why_ambassador' },
        { header: 'Initiatives', dataKey: 'initiatives' },
        { header: 'Events Managed', dataKey: 'events_managed' },
        { header: 'Cover Letter', dataKey: 'cover_letter' },
        { header: 'Created', dataKey: 'createdAt' },
        { header: 'Last Updated', dataKey: 'updatedAt' },
        { header: 'Status', dataKey: 'status' },
      ],
      body: preparedData,
      theme: 'grid',
      horizontalPageBreak: true,
      horizontalPageBreakRepeat: 0,
      horizontalPageBreakBehaviour: 'immediately',
    });
    // return pdf buffer
    const pdfBuffer = doc.output();
    return pdfBuffer;
  };

  async addAmbassador(data: INewAmbassador): Promise<IStudentAmbassador> {
    const exists = await this.checkIfAmbassadorExists(data.email);
    if (exists) {
      throw new BadRequestException('Ambassador already exists');
    }
    return await StudentAmbassador.create(data);
  }

  async fetchAllAmbassadors(query: Record<string, any>): Promise<any> {
    const { page = 1, limit = 10, ...otherFields } = query;
    const sort: SortOption = { createdAt: -1 };
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort,
    };
    const DBquery = { ...otherFields }; // other fields used to filter
    return await paginate(StudentAmbassador, DBquery, options);
  }

  async exportAmbassadorData(type: 'csv' | 'pdf'): Promise<any> {
    // fetch all ambassadors
    let ambassadors = await StudentAmbassador.find()
      .select(['-__v'])
      .lean()
      .exec();
    if (ambassadors.length === 0) {
      throw new BadRequestException('No ambassador added yet');
    }
    // remove __v field and add _id field
    ambassadors = ambassadors.map(a => ({ ...a, _id: a._id }));

    // generate filename
    const date = new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14);
    const filename = `${date}_ambassadors_export`;

    // remove xss from filename
    const cleanFilename = filename.replace(/[^a-zA-Z0-9-_]/g, '_');

    if (type === 'csv') {
      // convert json to csv
      const csvAmbassadors = json2csv(ambassadors);
      return {
        filename: `${cleanFilename}.csv`,
        contentType: 'text/csv',
        file: csvAmbassadors,
      };
    }
    // send the data to the generate pdf function
    const pdfBuffer = this.generatePDF(ambassadors);
    return {
      filename: `${cleanFilename}.pdf`,
      contentType: 'application/pdf',
      file: pdfBuffer,
    };
  }
}

export default new StudentAmbassadorService();
