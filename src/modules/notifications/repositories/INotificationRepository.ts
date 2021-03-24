import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

interface INotificationRepository {
  create(date: ICreateNotificationDTO): Promise<Notification>;
}

export default INotificationRepository;
