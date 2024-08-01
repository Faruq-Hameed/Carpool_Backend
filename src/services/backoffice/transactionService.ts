import { Transaction } from '@/database/models';
import { NotFoundException } from '@/exceptions';
import { paginate, type SortOption } from '@/utils/common';
class TransactionService {
  async getTransactions(query: Record<string, any>): Promise<any> {
    const {
      page = 1,
      limit = 10,
      name,
      type,
      parentCategory,
      status,
      ...otherFields
    } = query;
    const sort: SortOption = { createdAt: -1 };
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort,
      select: '', // remove fields from query
    };
    const DBquery: Record<string, any> = {
      ...otherFields,
      ...(name && { name }),
      ...(type && { type }),
      ...(parentCategory && { parent_category: parentCategory }),
      ...(status && { status }),
    };
    return await paginate(Transaction, DBquery, options);
  }

  async getUserTransactions(query: Record<string, any>): Promise<any> {
    const {
      page = 1,
      limit = 10,
      userId,
      name,
      type,
      parentCategory,
      status,
      ...otherFields
    } = query;
    const sort: SortOption = { createdAt: -1 };
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort,
      select: '', // remove fields from query
    };
    const DBquery: Record<string, any> = {
      user: userId,
      ...otherFields,
      ...(name && { name }),
      ...(type && { type }),
      ...(parentCategory && { parent_category: parentCategory }),
      ...(status && { status }),
    };

    return await paginate(Transaction, DBquery, options);
  }

  async getTransactionById(id: string): Promise<any> {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  // MANUAL AUDITOR TRANSACTION LOGICS
}

export default new TransactionService();
