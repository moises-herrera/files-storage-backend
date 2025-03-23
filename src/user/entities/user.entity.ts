import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Entity,
  EventArgs,
  OneToMany,
  Property,
  t,
} from '@mikro-orm/core';
import { hash, verify } from 'argon2';
import { BaseEntity } from 'src/common/entities/base.entity';
import { FilePermission } from 'src/storage/entities/file-permission.entity';
import { FolderPermission } from 'src/storage/entities/folder-permission.entity';
import { Folder } from 'src/storage/entities/folder.entity';

@Entity()
export class User extends BaseEntity {
  @Property({ type: t.string, length: 20 })
  firstName: string;

  @Property({ type: t.string, length: 20 })
  lastName: string;

  @Property({ type: t.string, length: 20, unique: true })
  username: string;

  @Property({ type: t.string, length: 50, unique: true })
  email: string;

  @Property({ type: t.text, hidden: true, lazy: true })
  password: string;

  @OneToMany({ entity: () => Folder, mappedBy: 'owner' })
  folders = new Collection<Folder>(this);

  @OneToMany({ entity: () => FolderPermission, mappedBy: 'user' })
  folderPermissions = new Collection<FolderPermission>(this);

  @OneToMany({ entity: () => FilePermission, mappedBy: 'user' })
  filePermissions = new Collection<FilePermission>(this);

  constructor(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
  ) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword(args: EventArgs<User>): Promise<void> {
    const password = args.changeSet?.payload.password;

    if (password) {
      this.password = await hash(password);
    }
  }

  async verifyPassword(passwordToVerify: string): Promise<boolean> {
    return verify(this.password, passwordToVerify);
  }
}
