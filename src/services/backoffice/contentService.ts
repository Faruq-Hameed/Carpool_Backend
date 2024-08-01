import { Content, type IContent } from '@/database/models';
import { BadRequestException, NotFoundException } from '@/exceptions';
import type { INewContent } from '@/interfaces/backoffice/contentInterface';
import { paginate, type SortOption } from '@/utils/common';

class ContentService {
  // function to check if the content already exists
  async checkContentExists(
    data: any,
  ): Promise<{ exists: boolean; existingContent?: IContent }> {
    const { name } = data;
    const existingContent = await Content.findOne({ name }, '_id');
    if (existingContent) {
      return { exists: true, existingContent };
    }
    return { exists: false };
  }

  async getContentByName(name: string): Promise<IContent | null> {
    const content = await Content.findOne({ name });
    if (!content) {
      throw new NotFoundException('Content does not exist');
    }
    return content;
  }

  async getContent(contentId: string): Promise<IContent | null> {
    const content = await Content.findById(contentId);
    if (!content) {
      throw new NotFoundException('Content does not exist');
    }
    return content;
  }

  async fetchContents(query: Record<string, any>): Promise<any> {
    const { page = 1, limit = 10, type, ...otherFields } = query;
    const sort: SortOption = { createdAt: -1 };
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort,
    };
    const DBquery: Record<string, any> = {
      ...otherFields,
      ...(type && { type }),
    }; // other fields used to filter
    return await paginate(Content, DBquery, options);
  }

  async addNewContent(data: INewContent): Promise<IContent> {
    const { exists } = await this.checkContentExists(data);
    if (exists) {
      throw new BadRequestException('Content already exists');
    }
    return await Content.create(data);
  }
}

export default new ContentService();
