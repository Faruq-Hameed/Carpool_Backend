import { Router } from 'express';
import {
  getAllCustomers,
  getCustomerById,
  getOutstandingBalance,
  getTotalActiveWithinPeriod,
  updateCustomerStatus,
  getUnverifiedCustomers,
  getUnTransactedCustomers,
  getCustomerNotes,
  createCustomerNote,
} from '@/controllers/backoffice/customersControllers';
import { managerAuthenticator } from '@/middlewares';

const customerRouter = Router();

customerRouter.use(managerAuthenticator);

// Get all customers with pagination */
customerRouter.get('/', getAllCustomers);

// create a new customer note
customerRouter.post('/:customerId/notes', createCustomerNote);

// get a customer notes
customerRouter.get('/:customerId/notes', getCustomerNotes);

// get all unverified customers
customerRouter.get('/unverified', getUnverifiedCustomers);

// get all untransacted customers
customerRouter.get('/untransacted', getUnTransactedCustomers);

// get total customer balance
customerRouter.get('/balance', getOutstandingBalance);

customerRouter.get('/transactions', getTotalActiveWithinPeriod);

// get customer by id
customerRouter.get('/:id', getCustomerById);

// update customer status
customerRouter.put('/:id', updateCustomerStatus);

export default customerRouter;
