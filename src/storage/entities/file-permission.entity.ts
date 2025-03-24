import { Entity, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from 'src/common/entities/base.entity';
import { File } from './file.entity';
import { User } from 'src/user/entities/user.entity';
import { Permission } from './permission.entity';

@Entity()
export class FilePermission extends BaseEntity {
  @ManyToOne({ entity: () => File })
  file: File;

  @ManyToOne({ entity: () => User })
  user: User;

  @ManyToOne({ entity: () => Permission })
  permission: Permission;

  constructor(file: File, user: User, permission: Permission) {
    super();
    this.file = file;
    this.user = user;
    this.permission = permission;
  }
}
