import { Schema, model, models } from 'mongoose';

const NoteSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
  },
  { timestamps: true }
);

export interface INote {
  _id?: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export default models.Note || model('Note', NoteSchema);
