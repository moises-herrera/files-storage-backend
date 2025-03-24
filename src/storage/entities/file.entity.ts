import {
  Cascade,
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
import { User } from 'src/user/entities/user.entity';

@Entity()
export class File extends BaseEntity {
  @Property({ type: t.string, length: 100 })
  name: string;

  @Property({ type: t.string, length: 100 })
  extension: string;

  @Property({ type: t.integer })
  size: number;

  @Property({ type: t.string, length: 100 })
  mimeType: string;

  @Property({ type: t.string })
  storagePath: string;

  @ManyToOne({ entity: () => User })
  owner: User;

  @ManyToOne({ entity: () => Folder })
  folder: Folder;

  @OneToMany({
    entity: () => FilePermission,
    mappedBy: 'file',
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  permissions = new Collection<FilePermission>(this);

  constructor(
    name: string,
    extension: string,
    size: number,
    mimeType: string,
    storagePath: string,
    owner: User,
    folder: Folder,
  ) {
    super();
    this.name = name;
    this.extension = extension;
    this.size = size;
    this.mimeType = mimeType;
    this.storagePath = storagePath;
    this.owner = owner;
    this.folder = folder;
  }
}
