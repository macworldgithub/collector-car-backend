// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type CarDocument = Car & Document;

// @Schema({ timestamps: true })
// export class Car {
//   @Prop({ required: true })
//   title: string;

//   @Prop({ required: true })
//   make: string;

//   @Prop()
//   description?: string;

//   @Prop({ type: Number, default: 0 })
//   price: number;

//    // ✅ Multiple images support
//   @Prop({ type: [String], default: [] })
//   images: string[];

//   @Prop({ type: [String], default: [] })
//   factoryOptions: string[];

//   @Prop({ type: [String], default: [] })
//   highlights: string[];

//   @Prop({
//     type: [{ label: String, value: String }],
//     default: [],
//   })
//   keyFeatures: { label: string; value: string }[];

//   @Prop({
//     type: [{ label: String, value: String }],
//     default: [],
//   })
//   specifications: { label: string; value: string }[];

//   @Prop({ type: String, enum: ['unsold', 'sold'], default: 'unsold' })
//   status: 'unsold' | 'sold';
// }

// export const CarSchema = SchemaFactory.createForClass(Car);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CarDocument = Car & Document;

@Schema({ timestamps: true })
export class Car {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  make: string;

  @Prop()
  description?: string;

  @Prop({ type: Number, default: 0 })
  price: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  factoryOptions: string[];

  @Prop({ type: [String], default: [] })
  highlights: string[];

  @Prop({
    type: [{ label: String, value: String }],
    default: [],
  })
  keyFeatures: { label: string; value: string }[];

  @Prop({
    type: [{ label: String, value: String }],
    default: [],
  })
  specifications: { label: string; value: string }[];

  @Prop({ type: String, enum: ['unsold', 'sold'], default: 'unsold' })
  status: 'unsold' | 'sold';

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const CarSchema = SchemaFactory.createForClass(Car);