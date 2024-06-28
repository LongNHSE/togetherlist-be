import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubscriptionTypeService } from './subscription_type.service';
import { CreateSubscriptionTypeDto } from './dto/create-subscription_type.dto';
import { UpdateSubscriptionTypeDto } from './dto/update-subscription_type.dto';
import { apiSuccess, apiFailed } from 'src/common/api-response';

@Controller('subscription-type')
export class SubscriptionTypeController {
  constructor(
    private readonly subscriptionTypeService: SubscriptionTypeService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createSubscriptionTypeDto: CreateSubscriptionTypeDto) {
    try {
      const createdSubscriptionType = await this.subscriptionTypeService.create(
        createSubscriptionTypeDto,
      );
      return apiSuccess(
        201,
        createdSubscriptionType,
        'Create subscription type successfully',
      );
    } catch (error) {}
  }

  @Get()
  async findAll() {
    try {
      const subscriptionTypes = await this.subscriptionTypeService.findAll();
      return apiSuccess(
        200,
        subscriptionTypes,
        'Get all subscription types successfully',
      );
    } catch (error) {
      return apiFailed(400, 'Get all subscription types failed');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const subscriptionType = await this.subscriptionTypeService.findOne(id);
      return apiSuccess(
        200,
        subscriptionType,
        'Get subscription type successfully',
      );
    } catch (error) {
      return apiFailed(400, 'Get subscription type failed');
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionTypeDto: UpdateSubscriptionTypeDto,
  ) {
    return this.subscriptionTypeService.update(+id, updateSubscriptionTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionTypeService.remove(+id);
  }
}
