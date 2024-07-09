import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SubscriptionPlanService } from './subscription-plan.service';
import { apiSuccess, apiFailed } from 'src/common/api-response';
import { AuthGuard } from '@nestjs/passport';
import { CreateSubscriptionPlanDto } from './dto/createSubscriptionPlanDto';
import { GetUser } from '../auth/decorator';
import { SubscriptionTypeService } from '../subscription_type/subscription_type.service';

@Controller('subscription-plans')
export class SubscriptionPlanController {
  constructor(
    private subscriptionPlanService: SubscriptionPlanService,
    private readonly subscriptionTypeService: SubscriptionTypeService,
  ) {}

  @Get()
  async findAll() {
    try {
      const subscriptionPlans = await this.subscriptionPlanService.findAll();
      return apiSuccess(
        200,
        subscriptionPlans,
        'Get all subscription plans successfully',
      );
    } catch (error) {
      return apiFailed(400, 'Get all subscription plans failed');
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto,
    @GetUser() user: any,
  ) {
    try {
      createSubscriptionPlanDto.userId = user.userId;

      const subscriptionType = await this.subscriptionTypeService.findOne(
        createSubscriptionPlanDto.subscriptionTypeId,
      );

      if (!subscriptionType) {
        return apiFailed(400, 'Subscription type not found');
      }

      const createdSubscriptionPlan = await this.subscriptionPlanService.create(
        createSubscriptionPlanDto,
        subscriptionType,
      );
      return apiSuccess(
        201,
        createdSubscriptionPlan,
        'Create subscription plan successfully',
      );
    } catch (error) {
      console.log(error);
      return apiFailed(400, 'Create subscription plan failed');
    }
  }

  @Get('/my')
  @UseGuards(AuthGuard('jwt'))
  async getMySubscriptionPlans(@GetUser() user: any) {
    try {
      const result = await this.subscriptionPlanService.findMySubscriptionPlan(
        user.userId,
      );
      return apiSuccess(200, result, 'Get subscription plans successfully');
    } catch (e) {
      throw e;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const subscriptionPlan = await this.subscriptionPlanService.findOne(id);
      return apiSuccess(
        200,
        subscriptionPlan,
        'Get subscription plan successfully',
      );
    } catch (error) {
      return apiFailed(400, 'Get subscription plan failed');
    }
  }
}
