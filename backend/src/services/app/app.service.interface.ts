import { IMessageEntity } from '@/entities/message.entity';

export interface IAppService {
  getHello(): IMessageEntity;
}
