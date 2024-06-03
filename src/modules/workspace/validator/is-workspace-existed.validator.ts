import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { WorkSpace } from '../schema/workspace.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsWorkspaceExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectModel(WorkSpace.name) private workspaceModel: Model<WorkSpace>,
  ) {}
  async validate(workspaceId: string) {
    console.log(workspaceId);
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return false;
    }
    const workspace = await this.workspaceModel.findById(workspaceId);
    return !!workspace;
  }
  defaultMessage?(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validationArguments?: ValidationArguments | undefined,
  ): string {
    return 'Workspace does not exist';
  }
}

export function IsWorkspaceExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsWorkspaceExistConstraint,
    });
  };
}
