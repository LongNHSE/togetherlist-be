export class GetChatDto {
  readonly last_id: string;
  readonly limit: number = 10;

  constructor(data: any) {
    Object.assign(this, data);
  }
}
