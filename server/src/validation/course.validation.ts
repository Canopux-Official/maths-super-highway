import { body, param, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Put this AFTER the validators in a route; it stops the request if any rule failed.
export const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return;
  }
  next();
};

const parentIdRule = body('parentId')
  .optional({ nullable: true })
  .custom((v) => v === null || /^[a-fA-F0-9]{24}$/.test(v))
  .withMessage('parentId must be a valid id or null');

const tagsRule = body('tags')
  .optional()
  .isArray({ max: 20 }).withMessage('tags must be an array (max 20)')
  .bail()
  .custom((arr: unknown[]) => arr.every((t) => typeof t === 'string' && t.trim().length <= 40))
  .withMessage('each tag must be text up to 40 characters');

export const validateCreateCourse: ValidationChain[] = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must not exceed 200 characters'),
  body('description').optional().isString().isLength({ max: 5000 }),
  tagsRule,
  parentIdRule,
  body('isActive').optional().isBoolean(),
];

export const validateUpdateCourse: ValidationChain[] = [
  param('id').isMongoId().withMessage('Invalid ID'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title must not exceed 200 characters'),
  body('description').optional().isString().isLength({ max: 5000 }),
  tagsRule,
  body('isActive').optional().isBoolean(),
  body('expectedUpdatedAt').optional().isISO8601(),
];

export const validateMoveCourse: ValidationChain[] = [
  param('id').isMongoId().withMessage('Invalid ID'),
  body('newParentId')
    .custom((v) => v === null || /^[a-fA-F0-9]{24}$/.test(v))
    .withMessage('newParentId must be a valid id or null'),
];

// export const validateReorder: ValidationChain[] = [
//   param('id').isMongoId().withMessage('Invalid ID'),
//   body('direction').isIn(['up', 'down']).withMessage('direction must be up or down'),
// ];

export const validateMongoId: ValidationChain[] = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];