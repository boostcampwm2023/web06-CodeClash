import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  if (args.constraints.length == 1) {
    return `${args.property} must be at least ${args.constraints[0]} characters long`;
  } else {
    return `${args.property} must be between ${args.constraints[0]} and ${args.constraints[1]} characters long`;
  }
};
