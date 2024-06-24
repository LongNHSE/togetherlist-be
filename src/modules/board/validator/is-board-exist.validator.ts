import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Board } from '../schema/board.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsBoardExistConstaint implements ValidatorConstraintInterface {
  constructor(@InjectModel(Board.name) private boardModel: Model<Board>) {}
  async validate(boardId: string) {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return false;
    }

    const board = await this.boardModel.findById(boardId);
    return !!board;
  }
  defaultMessage?(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validationArguments?: ValidationArguments | undefined,
  ): string {
    return `Board doesn't existed`;
  }
}

export function IsBoardExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBoardExistConstaint,
    });
  };
}
