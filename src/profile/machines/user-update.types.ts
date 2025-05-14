import { User, UserDocument } from '../../user/schemas/user.schema';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface UserCreatorContext {
  dto?: UpdateUserDto;
  user?: User;
  error?: any;
  status?: any;
}

export type UserCreatorServiceSchema = {
  updateUser: {
    data: {
      user: UserDocument;
    };
  };
};
