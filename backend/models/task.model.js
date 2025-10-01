import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  // Dispatch Management Fields
  dispatchUnique: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  uniqueId: {
    type: String,
    required: true,
    trim: true
  },
  soId: {
    type: String,
    required: true,
    trim: true
  },
  clientCode: {
    type: String,
    required: true,
    trim: true
  },
  productCode: {
    type: String,
    required: true,
    trim: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  batchNumber: {
    type: String,
    required: true,
    trim: true
  },
  batchSize: {
    type: Number,
    required: true,
    min: 1
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['PENDING', 'DISPATCH', 'STORE_1', 'STORE_2', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  dueDate: {
    type: Date,
    required: true
  },
  dispatchDate: {
    type: Date,
    default: null
  },
  assignedTo: {
    type: String,
    default: 'Unassigned',
    trim: true
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  orderType: {
    type: String,
    enum: ['POWER_CORD', 'COMPRESSOR', 'WIRE', 'OTHER'],
    default: 'OTHER'
  },
  dispatched: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ dispatchUnique: 1 });
taskSchema.index({ uniqueId: 1 });
taskSchema.index({ clientCode: 1 });
taskSchema.index({ productCode: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ status: 1, dueDate: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;

