import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidObjectId } from 'mongoose';

@ValidatorConstraint({ async: true, name: 'isObjectId' })
export class IsValidObjectIdConstraint implements ValidatorConstraintInterface {
  async validate(
    id: string,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    return isValidObjectId(id);
  }
  defaultMessage(validationArguments: ValidationArguments): string {
    return `${validationArguments.property} is not a valid ObjectId`;
  }
}

export function IsValidObjectId(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidObjectId',
      target: object.constructor,
      constraints: [property],
      options: validationOptions,
      propertyName: propertyName,
      validator: IsValidObjectIdConstraint,
      async: true,
    });
  };
}
