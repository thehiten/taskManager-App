import Task from '../models/task.model.js';

// Create dispatch task
export const createTask = async (req, res) => {
  try {
    const {
      uniqueId,
      soId,
      clientCode,
      productCode,
      productName,
      batchNumber,
      batchSize,
      quantity,
      dueDate,
      assignedTo,
      orderType
    } = req.body;
    
    const userId = req.user._id;
    const createdBy = req.user.email || 'system';

    // Generate unique dispatch ID
    const dispatchUnique = `DISP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const task = new Task({
      dispatchUnique,
      uniqueId,
      soId,
      clientCode,
      productCode,
      productName,
      batchNumber,
      batchSize,
      quantity,
      dueDate: new Date(dueDate),
      assignedTo: assignedTo || 'Unassigned',
      createdBy,
      orderType: orderType || 'OTHER',
      user: userId
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'Dispatch task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all tasks for a user with search, filter, and pagination
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { user: userId };

    // Add search filter
    if (search) {
      query.$or = [
        { dispatchUnique: { $regex: search, $options: 'i' } },
        { uniqueId: { $regex: search, $options: 'i' } },
        { soId: { $regex: search, $options: 'i' } },
        { clientCode: { $regex: search, $options: 'i' } },
        { productCode: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } }
      ];
    }

    // Add status filter
    if (status !== 'all') {
      query.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalTasks: total,
        hasNext: skip + tasks.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single task
export const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const {
      uniqueId,
      soId,
      clientCode,
      productCode,
      productName,
      batchNumber,
      batchSize,
      quantity,
      status,
      dueDate,
      dispatchDate,
      assignedTo,
      orderType,
      dispatched
    } = req.body;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Update fields
    if (uniqueId !== undefined) task.uniqueId = uniqueId;
    if (soId !== undefined) task.soId = soId;
    if (clientCode !== undefined) task.clientCode = clientCode;
    if (productCode !== undefined) task.productCode = productCode;
    if (productName !== undefined) task.productName = productName;
    if (batchNumber !== undefined) task.batchNumber = batchNumber;
    if (batchSize !== undefined) task.batchSize = batchSize;
    if (quantity !== undefined) task.quantity = quantity;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = new Date(dueDate);
    if (dispatchDate !== undefined) task.dispatchDate = dispatchDate ? new Date(dispatchDate) : null;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (orderType !== undefined) task.orderType = orderType;
    if (dispatched !== undefined) task.dispatched = dispatched;

    // Auto-set dispatch date when status changes to DISPATCH
    if (status === 'DISPATCH' && !task.dispatchDate) {
      task.dispatchDate = new Date();
      task.dispatched = true;
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const task = await Task.findOneAndDelete({ _id: id, user: userId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

