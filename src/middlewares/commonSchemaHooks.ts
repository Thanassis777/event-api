import { Schema } from 'mongoose';

import { removeVersionKey } from '../utils/removeVersionKey';

export function commonSchemaHooks(schema: Schema): void {
  // middleware running during execution of 'find like' asynchronous functions(e.g findById(), find() etc)
  schema.pre(/^find/, removeVersionKey);
}
