import { body, param, ValidationChain } from 'express-validator';

export const validateCreateCourse: ValidationChain[] = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must not exceed 200 characters'),

  body('content')
    .optional()
    .isString().withMessage('Content must be a string'),

  body('parentId')
    .optional({ nullable: true })
    .custom((value) => value === null || /^[a-fA-F0-9]{24}$/.test(value))
    .withMessage('parentId must be a valid MongoDB ObjectId or null'),

  body('itemType')
    .optional()
    .isIn(['category', 'course', 'topic'])
    .withMessage('itemType must be one of: category, course, topic'),
];

export const validateUpdateCourse: ValidationChain[] = [
  param('id').isMongoId().withMessage('Invalid course ID'),

  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title must not exceed 200 characters'),

  body('content')
    .optional()
    .isString().withMessage('Content must be a string'),

  body('parentId')
    .optional({ nullable: true })
    .custom((value) => value === null || /^[a-fA-F0-9]{24}$/.test(value))
    .withMessage('parentId must be a valid MongoDB ObjectId or null'),

  body('itemType')
    .optional()
    .isIn(['category', 'course', 'topic'])
    .withMessage('itemType must be one of: category, course, topic'),
];

export const validateMongoId: ValidationChain[] = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];