import { OptionalProps, PrimaryKey, Property, t } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

export abstract class BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey({ type: t.uuid })
  id = uuid();

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
