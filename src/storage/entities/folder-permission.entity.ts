import { Entity, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Folder } from './folder.entity';
import { User } from 'src/user/entities/user.entity';
import { Permission } from './permission.entity';

@Entity()
export class FolderPermission extends BaseEntity {
  @ManyToOne({ entity: () => Folder })
  folder: Folder;

  @ManyToOne({ entity: () => User })
  user: User;

  @ManyToOne({ entity: () => Permission })
  permission: Permission;
}
