export class CreateSubscriptionPlanDto {
  userId: string;
  subscriptionTypeId: string;
  from: Date;
  to: Date;
  status: string;
}
