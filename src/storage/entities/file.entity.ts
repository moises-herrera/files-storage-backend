import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
  t,
} from '@mikro-orm/core';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Folder } from './folder.entity';
import { FilePermission } from './file-permission.entity';

@Entity()
export class File extends BaseEntity {
  @Property({ type: t.string, length: 100 })
  name: string;

  @ManyToOne({ entity: () => Folder })
  folder: Folder;

  @OneToMany({ entity: () => FilePermission, mappedBy: 'file' })
  permissions = new Collection<FilePermission>(this);
}
