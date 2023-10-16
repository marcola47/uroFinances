import { v4 as uuid } from 'uuid';

const idSchema = {
  type: String, 
  default: uuid,
  required: true,
  unique: true,
  validate: { 
    validator: function(v: string) { return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v); },
    message: (props: any) => `${props.value} is not a valid uuid v4!`
  }
};

export default idSchema;