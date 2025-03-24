import {
  BeforeCreate,
  BeforeUpdate,
  Cascade,
  Collection,
  Entity,
  EventArgs,
  OneToMany,
  Property,
  t,
} from '@mikro-orm/core';
import { BaseEntity } from 'src/common/entities/base.entity';
import { File } from 'src/storage/entities/file.entity';
import { Folder } from 'src/storage/entities/folder.entity';
import { FilePermission } from 'src/storage/entities/file-permission.entity';
import { FolderPermission } from 'src/storage/entities/folder-permission.entity';
import { HasherService } from 'src/common/services/hasher.service';

@Entity()
export class User extends BaseEntity {
  @Property({ type: t.string, length: 20 })
  firstName: string;

  @Property({ type: t.string, length: 20 })
  lastName: string;

  @Property({ type: t.string, length: 50, unique: true })
  email: string;

  @Property({ type: t.text, hidden: true, lazy: true })
  password: string;

  @Property({ type: t.string, nullable: true, hidden: true, lazy: true })
  refreshToken?: string;

  @OneToMany({
    entity: () => File,
    mappedBy: 'owner',
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  files = new Collection<File>(this);

  @OneToMany({
    entity: () => Folder,
    mappedBy: 'owner',
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  folders = new Collection<Folder>(this);

  @OneToMany({
    entity: () => FilePermission,
    mappedBy: 'user',
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  filePermissions = new Collection<FilePermission>(this);

  @OneToMany({
    entity: () => FolderPermission,
    mappedBy: 'user',
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  folderPermissions = new Collection<FolderPermission>(this);

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword(args: EventArgs<User>): Promise<void> {
    const password = args.changeSet?.payload.password;

    if (password) {
      this.password = await HasherService.hashPassword(password);
    }
  }

  async verifyPassword(passwordToVerify: string): Promise<boolean> {
    return HasherService.verifyPassword(this.password, passwordToVerify);
  }
}
