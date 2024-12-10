import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    trim: true,
    unique: true
  },
  color: {
    type: String,
    required: [true, 'La couleur est requise'],
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'La couleur doit être au format hexadécimal (ex: #FF0000)'],
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour optimiser les recherches
categorySchema.index({ name: 1 }, { unique: true });

export const Category = mongoose.model('Category', categorySchema);