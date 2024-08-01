import type { Request, Response, NextFunction } from 'express';

import createHttpError, { type UnknownError } from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { contentValidator } from '@/utils/joiSchemas';
import ContentService from '@/services/backoffice/contentService';
import { type INewContent } from '@/interfaces/backoffice/contentInterface';

export const addContent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { error, value }: { error: any; value: INewContent } =
      contentValidator(req.body);
    if (error !== null && error !== undefined) {
      next(
        createHttpError(
          StatusCodes.BAD_REQUEST,
          error.details[0].message as UnknownError,
        ),
      );
      return;
    }
    const content = await ContentService.addNewContent(value);
    return res.status(StatusCodes.CREATED).json({
      message: 'Content Created',
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllContents = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const contents = await ContentService.fetchContents(req.query);
    return res.status(StatusCodes.OK).json({
      message: 'All Contents Retrieved',
      data: contents,
    });
  } catch (error) {
    next(error);
  }
};

export const getContent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const contentId = req.params.id;
  try {
    const content = await ContentService.getContent(contentId);
    return res.status(StatusCodes.OK).json({
      message: 'Content Retrieved',
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

export const getContentByName = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { name } = req.params;
  try {
    const content = await ContentService.getContentByName(name);
    return res.status(StatusCodes.OK).json({
      message: 'Content Retrieved',
      data: content,
    });
  } catch (error) {
    next(error);
  }
};
