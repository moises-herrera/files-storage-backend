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

  @OneToMany({
    entity: () => Folder,
    mappedBy: 'parentFolder',
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  subFolders = new Collection<Folder>(this);

  @OneToMany({
    entity: () => File,
    mappedBy: 'folder',
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  files = new Collection<File>(this);

  @OneToMany({
    entity: () => FolderPermission,
    mappedBy: 'folder',
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  permissions = new Collection<FolderPermission>(this);

  constructor(name: string, owner: User, parentFolder?: Folder) {
    super();
    this.name = name;
    this.owner = owner;
    this.parentFolder = parentFolder;
  }
}
