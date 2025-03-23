import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
  t,
} from '@mikro-orm/core';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { File } from './file.entity';
import { FolderPermission } from './folder-permission.entity';

@Entity()
export class Folder extends BaseEntity {
  @Property({ type: t.string, length: 100 })
  name: string;

  @ManyToOne({ entity: () => User })
  owner: User;

  @ManyToOne({ entity: () => Folder, nullable: true })
  parentFolder?: Folder;

  @OneToMany({ entity: () => Folder, mappedBy: 'parentFolder' })
  subFolders = new Collection<Folder>(this);

  @OneToMany({ entity: () => File, mappedBy: 'folder' })
  files = new Collection<File>(this);

  @OneToMany({ entity: () => FolderPermission, mappedBy: 'folder' })
  permissions = new Collection<FolderPermission>(this);
}
