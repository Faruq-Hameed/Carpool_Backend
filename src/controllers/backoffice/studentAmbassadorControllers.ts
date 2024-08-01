import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import StudentAmbassadorService from '@/services/backoffice/ambassadorService';

export const getAllAmbassadors = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const ambassadors = await StudentAmbassadorService.fetchAllAmbassadors(
      req.query,
    );
    return res.status(StatusCodes.OK).send({
      message: 'All Ambassadors Retrieved',
      data: ambassadors,
    });
  } catch (error) {
    next(error);
  }
};

export const exportAmbassadors = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const type = (req.query.type as 'csv' | 'pdf') || 'pdf';
  try {
    const { filename, contentType, file } =
      await StudentAmbassadorService.exportAmbassadorData(type);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', `${contentType}`);

    // file deepcode ignore XSS: <no xss issue on file response>
    return res.status(StatusCodes.OK).send(file);
  } catch (error) {
    next(error);
  }
};
