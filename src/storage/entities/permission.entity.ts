import {
  Collection,
  Entity,
  OneToMany,
  Opt,
  Property,
  t,
} from '@mikro-orm/core';
import { BaseEntity } from 'src/common/entities/base.entity';
import { FilePermission } from './file-permission.entity';
import { FolderPermission } from './folder-permission.entity';

@Entity()
export class Permission extends BaseEntity {
  @Property({ type: t.string, length: 100, unique: true })
  name: string;

  @Property({ type: t.string, length: 200, nullable: true })
  description?: string & Opt;

  @OneToMany({ entity: () => FolderPermission, mappedBy: 'permission' })
  folderPermissions = new Collection<FolderPermission>(this);

  @OneToMany({ entity: () => FilePermission, mappedBy: 'permission' })
  filePermissions = new Collection<FilePermission>(this);

  constructor(name: string, description?: string) {
    super();
    this.name = name;
    this.description = description;
  }
}
