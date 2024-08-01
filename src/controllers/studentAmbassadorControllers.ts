import type { Request, Response, NextFunction } from 'express';
import createHttpError, { type UnknownError } from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import formidable from 'formidable';
import { studentAmbassadorValidator } from '@/utils/joiSchemas';
import StudentAmbassadorService from '@/services/backoffice/ambassadorService';
import type { INewAmbassador } from '@/interfaces/ambassadorInterface';
import { uploadImages } from '@/utils';

export const addAmbassador = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const form = formidable({ multiples: true });

  form.parse(req, async (error, fields, files) => {
    if (error) {
      next(error);
      return;
    }
    try {
      const storedFiles = await uploadImages(files, ['cover_letter']);
      const {
        level,
        socialMedia = fields.social_media,
        eventsManaged = fields.events_managed,
        ...remainingFields
      } = fields;
      const selectedRemainingFields: Record<string, any> = {};
      for (const key in remainingFields) {
        const skip: string[] = ['social_media', 'events_managed'];
        if (skip.includes(key)) {
          continue;
        }
        if (Array.isArray(remainingFields[key])) {
          selectedRemainingFields[key] = remainingFields[key]?.[0];
        } else {
          selectedRemainingFields[key] = remainingFields[key];
        }
      }
      const body: any = {
        level: Array.isArray(level) ? +level[0] : level ? +level : undefined,
        events_managed: Array.isArray(eventsManaged)
          ? +eventsManaged[0]
          : eventsManaged
            ? +eventsManaged
            : undefined,
        ...(socialMedia && { social_media: socialMedia[0].split(', ') }),
        ...selectedRemainingFields,
        ...(storedFiles && { cover_letter: storedFiles }),
      };
      const { error, value } = studentAmbassadorValidator(body);
      if (error !== null && error !== undefined) {
        next(
          createHttpError(
            StatusCodes.BAD_REQUEST,
            error.details[0].message as UnknownError,
          ),
        );
        return;
      }
      const studentAmbassador = await StudentAmbassadorService.addAmbassador(
        value as INewAmbassador,
      );
      return res.status(StatusCodes.OK).send({
        message: 'Your application has been received',
        data: studentAmbassador,
      });
    } catch (error) {
      next(error);
    }
  });
};
