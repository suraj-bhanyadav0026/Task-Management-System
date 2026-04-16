import Task from '../models/Task.js';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  assignedTo: z.string().optional().nullable()
});

export const createTask = async (req, res, next) => {
  try {
    const parsed = taskSchema.parse(req.body);
    
    // Process attachments if they exist via multer
    const attachments = [];
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        res.status(400);
        throw new Error('Maximum 3 attachments allowed per task');
      }
      req.files.forEach(file => {
        attachments.push({
          filename: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size
        });
      });
    }

    const task = await Task.create({
      ...parsed,
      creator: req.user._id, // User from auth middleware
      attachments
    });

    res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400);
      const e = new Error('Validation Error');
      e.errors = error.errors;
      return next(e);
    }
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, sort, page = 1, limit = 10, search } = req.query;

    const query = {};

    // For non-admins, ensure they can only see tasks they created or are assigned to
    if (req.user.role !== 'admin') {
      query.$or = [{ creator: req.user._id }, { assignedTo: req.user._id }];
    }

    // Applying filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Applying sorting
    let sortObj = {};
    if (sort === 'dueDate_asc') sortObj.dueDate = 1;
    else if (sort === 'dueDate_desc') sortObj.dueDate = -1;
    else sortObj.createdAt = -1; // Default desc

    const skip = (Number(page) - 1) * Number(limit);

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('creator', 'name email')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('creator', 'name email');
      
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Security check
    if (req.user.role !== 'admin' && 
        task.creator.toString() !== req.user._id.toString() &&
        task.assignedTo?._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view this task');
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (req.user.role !== 'admin' && 
        task.creator.toString() !== req.user._id.toString() &&
        task.assignedTo?.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    // We can use a partial schema for updates
    const parsed = taskSchema.partial().parse(req.body);

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: parsed },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    res.json(updatedTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400);
      const e = new Error('Validation Error');
      e.errors = error.errors;
      return next(e);
    }
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (req.user.role !== 'admin' && task.creator.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};
