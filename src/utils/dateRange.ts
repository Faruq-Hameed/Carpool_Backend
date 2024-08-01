import { BadRequestException } from '@/exceptions';
import { isValidDate } from './common';
import { type DateRange } from './types/general';

/** a function that returns validated dates if specified if not default date(s) will be return */
export const dateRangeValidator = (dateData: {
  startDate?: string;
  endDate?: string;
}): DateRange => {
  const { startDate, endDate } = dateData;

  // check if the query parameters are valid date types
  if (
    (startDate && !isValidDate(startDate)) ??
    (endDate && !isValidDate(endDate))
  ) {
    throw new BadRequestException('Invalid date format');
  }

  // set defaults time range to be within and and last 30 days
  const currentDate = new Date();

  /** set the default start date by getting the current date - 30 days from current date **/
  const defaultStartDate = new Date();
  defaultStartDate.setDate(currentDate.getDate() - 30);

  return {
    startDate: startDate ? new Date(startDate) : defaultStartDate,
    endDate: endDate ? new Date(endDate) : currentDate,
  };
};
